import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { PlaylistAnalysisService } from 'src/app/services/spotify/playlist-analysis.service';
import { SimplePlaylist, SimpleTrack } from '@app/services/spotify/models/simple-playlist';
import { DBSTANDARD, DBUNIT } from '@app/services/spotify/constants/loudness.constants'
@Component({
    selector: 'app-playlist-analysis',
    templateUrl: './playlist-analysis.component.html',
    styleUrls: ['./playlist-analysis.component.scss']
})


export class PlaylistAnalysisComponent implements OnInit, OnChanges {
    private _playlist!: SimplePlaylist;
    private _selectedTrackId?: string;
    public trackName?: string;
    public danceRank?: number;
    public bpm?: number;
    public loudness?: number = 0;
    public loudnessGrade?: number = 0;
    public single: any[] = [];
    public numberCardView: [number, number] = [800, 150];
    public dbChartView: [number, number] = [600, 100];
    public colorScheme: string | Color = {
        name: 'myScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };
    cardColor: string = '#232837';
    public loudnessUnit = DBUNIT.DB;
    public loudnessMax = DBSTANDARD.MAX;
    public loudnessMin = DBSTANDARD.MIN;
    public loudnessStandard = DBSTANDARD.LOUD;
    public popularity?: number;
    public tempo?: number;
    public albumImg?: URL;
    public totalNum?: number = 0


    @Input() set playlist(value: SimplePlaylist) {
        this._playlist = value;
    }
    get playlist(): SimplePlaylist {
        return this._playlist;
    }
    @Input() set selectedTrackId(id: string) {
        this._selectedTrackId = id;
    }
    get selectedTrackId(): string {
        return this._selectedTrackId || '';
    }

    constructor(private analysis: PlaylistAnalysisService) {
    }

    ngOnInit(): void {
        this.updateSelectedTrack();
        this.analysis.updateTracksRank(this._playlist);
    }

    ngOnChanges(): void {
        this.updateSelectedTrack();
    }

    private updateSelectedTrack(): void {
        if (!this._selectedTrackId) { return };

        const track = this.getTrackWithId(this._selectedTrackId);
        this.trackName = track?.name || '';
        this.danceRank = this.analysis.getTracksRank(track);
        this.bpm = Math.floor(track?.features?.tempo || 0);
        this.loudness = track?.features?.loudness;
        this.popularity = track?.popularity;
        this.tempo = track?.features?.tempo;
        this.loudnessGrade = this.analysis.getTracksIsLoud(track?.features?.loudness || -1)
        this.single = [
            {
                name: this.analysis.getTracksRankLabel(track), value: this.danceRank,
            },
            {
                name: "BPM", value: this.bpm,
            },
            {
                name: "loudness", value: this.loudness,
            },
            {
                name: "popularity", value: this.popularity,
            },
            {
                name: "tempo", value: this.tempo,
            },
        ]
        this.albumImg = new URL(track.album.image.url)
    }

    //utility
    private getTrackWithId(id: string): SimpleTrack {
        return (this._playlist?.tracks?.items.find((t) => t.id === id)) as SimpleTrack;
    }

}
