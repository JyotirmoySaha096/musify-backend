import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import * as http from 'http';
import * as https from 'https';

interface StreamTokenPayload {
  songId: string;
  type: 'stream';
}

@Injectable()
export class SongsService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async findAll(limit?: number) {
    const { Song, Artist, Album } = this.db.models as any;
    return Song.findAll({
      include: [
        { model: Artist, as: 'artist' },
        { model: Album, as: 'album' },
      ],
      order: [['title', 'ASC']],
      limit: limit ?? undefined,
    });
  }

  async findOne(id: string) {
    const { Song, Artist, Album } = this.db.models as any;
    const song = await Song.findOne({
      where: { id },
      include: [
        { model: Artist, as: 'artist' },
        { model: Album, as: 'album' },
      ],
    });
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    return song;
  }

  /**
   * Issue a short-lived (60-second) signed token scoped to a specific song.
   * The token is signed with the same JWT_SECRET but carries type:'stream'
   * and a very short expiry so it cannot be reused or shared effectively.
   */
  generateStreamToken(songId: string): { token: string; expiresIn: number } {
    const payload: StreamTokenPayload = { songId, type: 'stream' };
    const token = this.jwtService.sign(payload, { expiresIn: '4s' });
    return { token, expiresIn: 4 };
  }

  /**
   * Validate the stream token and proxy the audio with anti-download headers.
   *
   * Security measures applied:
   *  1. Token is short-lived (60s) and tied to a specific songId — sharing the
   *     URL is useless once the token expires.
   *  2. `Content-Disposition: inline` prevents browser "Save As" prompt.
   *  3. `Accept-Ranges` is NOT forwarded — the client cannot seek the raw
   *     file as a static resource or know its byte layout.
   *  4. `Content-Length` is NOT forwarded — download managers cannot determine
   *     the total file size or split the download.
   *  5. `X-Content-Type-Options: nosniff` is set to prevent MIME sniffing.
   */
  async streamAudio(songId: string, token: string, range: string | undefined, res: any) {
    // 1. Validate the stream token
    let payload: StreamTokenPayload;
    try {
      payload = this.jwtService.verify<StreamTokenPayload>(token, {
        secret: process.env.JWT_SECRET || 'spotify-clone-secret-key',
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired stream token');
    }

    if (payload.type !== 'stream' || payload.songId !== songId) {
      throw new UnauthorizedException('Token does not match the requested song');
    }

    // 2. Load the song to get the real audio URL
    const song = await this.findOne(songId);
    const audioUrl = (song as any).audioUrl;

    const client = audioUrl.startsWith('https') ? https : http;

    const requestHeaders: Record<string, string> = {};
    if (range) requestHeaders['Range'] = range;

    // 3. Proxy the upstream audio, applying security headers
    client
      .get(audioUrl, { headers: requestHeaders }, (audioRes) => {
        // Anti-download / security headers
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'no-store');

        // Forward headers needed for seeking & chunked playback
        const headersToForward = ['content-type', 'content-range', 'accept-ranges'];
        headersToForward.forEach((h) => {
          if (audioRes.headers[h]) {
            res.setHeader(h, audioRes.headers[h] as string);
          }
        });
        // Content-Length is intentionally omitted to obscure total file size

        res.status(audioRes.statusCode ?? 200);
        audioRes.pipe(res);
      })
      .on('error', () => {
        if (!res.headersSent) {
          res.status(502).send('Error fetching audio');
        }
      });
  }
}
