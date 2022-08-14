

import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { MODE } from '@app/services/spotify/constants/mode.constants';
import { SimplePlaylist, SimpleTrack } from '@app/services/spotify/models/simple-playlist';
import { PlaylistAnalysisService } from '@app/services/spotify/playlist-analysis.service';

@Component({
    selector: 'track-card-list',
    templateUrl: 'track-card-list.component.html',
    styleUrls: ['track-card-list.component.scss']
})

export class TrackCardListComponent implements OnInit, OnChanges {
    public popularity?: number;
    public tempo?: number;
    public sorting: MODE.FASTEST | MODE.SLOWEST | MODE.POPULAR | MODE.DANCEABILITY = MODE.DANCEABILITY
    public sortingModes = [MODE.FASTEST, MODE.SLOWEST, MODE.POPULAR, MODE.DANCEABILITY]
    public colorSet = ['#f2c400', '#bba19a', '#874c08']
    private _playlist!: SimplePlaylist;


    @Input() set playlist(value: SimplePlaylist) {
        this._playlist = value;
    }
    get playlist(): SimplePlaylist {
        return this._playlist;
    }
    @Output() selectTrack = new EventEmitter<SimpleTrack>();

    constructor(private analysis: PlaylistAnalysisService) { }

    ngOnInit() {
        this.updateSorting();
    }

    ngOnChanges(): void {
        this.updateSorting();
        this.onClickCard(this._playlist.tracks.items[0]);
    }

    public updateSorting(mode: MODE.FASTEST | MODE.SLOWEST | MODE.POPULAR | MODE.DANCEABILITY = MODE.DANCEABILITY) {
        const { items } = this._playlist.tracks;
        this.analysis.updateTracksRank(this._playlist)
        switch (mode) {
            case MODE.FASTEST:
                this._playlist.tracks.items = items.sort(this.analysis.compareBPMFast);
                this.sorting = MODE.FASTEST;
                return;
            case MODE.SLOWEST:
                this._playlist.tracks.items = items.sort(this.analysis.compareBPMSlow);
                this.sorting = MODE.SLOWEST;
                return;
            case MODE.POPULAR:
                this._playlist.tracks.items = items.sort(this.analysis.comparePopular);
                this.sorting = MODE.POPULAR;
                return;
            case MODE.DANCEABILITY:
                this._playlist.tracks.items = this.analysis.getRankedTracks()
                this.sorting = MODE.DANCEABILITY;
                return;
        }
    }

    public onClickCard(track: SimpleTrack) {
        this.selectTrack.emit(track);
    }

    public onSelectMode(mode: MODE.FASTEST | MODE.SLOWEST | MODE.POPULAR | MODE.DANCEABILITY) {
        this.updateSorting(mode);
        this.onClickBackToTop()
    }

    public onClickBackToTop() {
        const listEle = document.querySelector(".playlist-tracks") as HTMLElement;
        setTimeout(() => {
            listEle.scrollTop = 0;
        }, 0);
    }
}