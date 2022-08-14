import { Injectable } from "@angular/core";
import { DBSTANDARD } from "./constants/loudness.constants";
import { SimplePlaylist, SimpleTrack } from "./models/simple-playlist";

@Injectable({
    providedIn: 'root'
})
export class PlaylistAnalysisService {

    private _ranking: SimpleTrack[] = []; 

    public updateTracksRank(playlist: SimplePlaylist): void {
        this._ranking = [...playlist.tracks.items.sort(this.compareDanceability)]
    }

    public getRankedTracks(): SimpleTrack[] {
        return this._ranking  
    }
    
    // could use switch for them
    public compareDanceability(a: SimpleTrack, b: SimpleTrack) {
        if ((a.features?.danceability || 0) < (b.features?.danceability || 0)) {
            return -1;
        }
        if ((a.features?.danceability || 0) > (b.features?.danceability || 0)) {
            return 1;
        }
        return 0;
    }

    public compareBPMSlow(a: SimpleTrack, b: SimpleTrack) {
        if ((a.features?.tempo || 0) < (b.features?.tempo || 0)) {
            return -1;
        }
        if ((a.features?.tempo || 0) > (b.features?.tempo || 0)) {
            return 1;
        }
        return 0;
    }

    public compareBPMFast(a: SimpleTrack, b: SimpleTrack) {
        if ((a.features?.tempo || 0) > (b.features?.tempo || 0)) {
            return -1;
        }
        if ((a.features?.tempo || 0) < (b.features?.tempo || 0)) {
            return 1;
        }
        return 0;
    }

    public comparePopular(a: SimpleTrack, b: SimpleTrack) {
        if ((a.popularity || 0) > (b.popularity || 0)) {
            return -1;
        }
        if ((a.popularity || 0) < (b.popularity || 0)) {
            return 1;
        }
        return 0;
    }

    public getTracksRankLabel(track: SimpleTrack): string { 
        return `Danceability (over ${this._ranking.length})`;
    }

    public getTracksRank(track: SimpleTrack): number {
        const { id = '' } = track;
        return this._ranking.findIndex((st) => st.id === id) + 1;
    }

    public getTracksIsLoud(db: number): number {
        if (db > DBSTANDARD.LOUD+6) {
            return 3;
        }
        if (db > DBSTANDARD.LOUD+3) {
            return 2;
        }
        if (db > DBSTANDARD.LOUD) {
            return 1;
        }
        if (db < DBSTANDARD.QUIET) {
            return -1;
        }
        return 0;
    }
}