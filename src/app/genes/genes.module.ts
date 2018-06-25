import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GenesRoutingModule } from './genes-routing.module';
import { ChartsModule } from '../charts';
import { AppSharedModule } from '../shared';

import { SharedModule } from 'primeng/shared';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

import { GenesViewComponent } from './genes-view';
import { GenesIntroComponent } from './genes-intro';
import { GenesListComponent } from './genes-list';
import { GeneSearchComponent } from './gene-search';
import { GeneOverviewComponent } from './gene-details/gene-overview';
import { GeneRNASeqDEComponent } from './gene-details/gene-rnaseq-de';
import { GeneNetworkComponent } from './gene-details/gene-network';
import { BoxPlotsViewComponent } from './gene-details/gene-rnaseq-de/box-plots-view';

@NgModule({
    declarations: [
        GenesViewComponent,
        GenesIntroComponent,
        GenesListComponent,
        GeneSearchComponent,
        GeneOverviewComponent,
        GeneRNASeqDEComponent,
        GeneNetworkComponent,
        BoxPlotsViewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppSharedModule.forRoot(),
        GenesRoutingModule,
        ChartsModule,
        // PrimeNG modules
        SharedModule,
        PanelModule,
        ButtonModule,
        TableModule,
        DialogModule,
        CardModule,
        TabViewModule,
        ProgressBarModule,
        MultiSelectModule
    ],
    entryComponents: [
        BoxPlotsViewComponent
    ]
})
// Changed the name so it does not conflict with primeng module
export class GenesModule {}
