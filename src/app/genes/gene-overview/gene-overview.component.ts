import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    OnDestroy,
    ViewChild,
    AfterContentChecked
} from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { RouterEvent, NavigationEnd, NavigationExtras } from '@angular/router';

import { Gene, GeneInfo, GeneNetwork, GeneResponse, GenesResponse } from '../../models';

import {
    ApiService,
    DataService,
    GeneService,
    ForceService,
    NavigationService
} from '../../core/services';

import { MenuItem } from 'primeng/api';

import * as d3 from 'd3';

@Component({
    selector: 'gene-overview',
    templateUrl: './gene-overview.component.html',
    styleUrls: [ './gene-overview.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneOverviewComponent implements OnInit, OnDestroy, AfterContentChecked {
    @Input() styleClass: string = 'overview-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;
    @Input() models: string[] = [];
    @Input() tissues: string[] = [];
    @Input() dataLoaded: boolean = false;
    @ViewChild('overviewMenu') menu: MenuItem[];

    extras: NavigationExtras = {
        relativeTo: this.navService.getRoute(),
        skipLocationChange: true
    };
    activeItem: MenuItem;
    currentGeneData = [];
    subscription: any;
    iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
    items: MenuItem[];
    neverActivated: boolean = true;
    disableMenu: boolean = false;

    constructor(
        private location: PlatformLocation,
        private navService: NavigationService,
        private apiService: ApiService,
        private geneService: GeneService,
        private dataService: DataService,
        private forceService: ForceService
    ) { }

    ngOnInit() {
        // Populate the tab menu
        this.items = [
            { label: 'NOMINATION DETAILS', disabled: this.disableMenu },
            { label: 'SUMMARY', disabled: this.disableMenu },
            { label: 'EVIDENCE', disabled: this.disableMenu },
            { label: 'DRUGGABILITY', disabled: this.disableMenu }
        ];

        this.navService.getRouter().events.subscribe((re: RouterEvent) => {
            if (re instanceof NavigationEnd) {
                if (this.disableMenu) {
                    // Improve this part, 0.8 seconds to re-activate the menu items
                    setTimeout(() => {
                        this.items.forEach((i) => {
                            i.disabled = false;
                        });
                        this.disableMenu = false;
                    }, 800);
                }
            }
        });
        this.location.onPopState(() => {
            this.navService.setOvMenuTabIndex(0);
        });

        // Get the current clicked gene, always update
        this.subscription = this.forceService.getGenes()
            .subscribe((data: GeneNetwork) => this.currentGeneData = data.nodes);
        this.gene = this.geneService.getCurrentGene();
        this.geneInfo = this.geneService.getCurrentInfo();
        this.id = this.navService.getId();

        // If we don't have a Gene or any Models/Tissues here, or in case we are
        // reloading the page, try to get it from the server and move on
        if (!this.gene || !this.geneInfo || this.id !== this.gene.ensembl_gene_id
            || !this.gene.ensembl_gene_id || this.gene.hgnc_symbol !==
            this.geneService.getCurrentGene().hgnc_symbol
        ) {
            this.apiService.getGene(this.id).subscribe((data: GeneResponse) => {
                if (!data.info) {
                    this.navService.goToRoute('/genes');
                } else {
                    if (!data.item) {
                        // Fill in a new gene with the info attributes
                        data.item = this.geneService.getEmptyGene(
                            data.info.ensembl_gene_id, data.info.hgnc_symbol
                        );
                        this.geneService.setInfoDataState(true);
                    }
                    this.geneService.updatePreviousGene();
                    this.geneService.updateGeneData(data);
                    this.gene = data.item;
                    this.geneInfo = data.info;
                }
            }, (error) => {
                console.log('Error loading gene overview! ' + error.message);
            }, () => {
                this.initTissuesModels();
            });
        } else {
            this.initTissuesModels();
        }
    }

    ngAfterContentChecked() {
        if (this.menu && this.neverActivated) {
            this.activateMenu();
        }
    }

    activateMenu() {
        d3.selectAll('.mc-tooltip, .bp-tooltip, .bp-axis-tooltip, .rc-tooltip')
            .remove();

        if (((!this.disableMenu && ((this.activeItem && this.menu['activeItem'])
            ? (this.activeItem.label !== this.menu['activeItem'].label) : false)
            ) || this.neverActivated) && this.dataLoaded) {
            this.neverActivated = false;
            this.disableMenu = true;
            this.items.forEach((i) => {
                i.disabled = true;
            });

            this.activeItem = this.menu['activeItem'];
            if (this.activeItem) {
                switch (this.activeItem.label) {
                    case 'NOMINATION DETAILS':
                        if (this.geneInfo.nominations) {
                            this.navService.setOvMenuTabIndex(0);
                        }
                        this.navService.goToRoute('/genes', {
                            outlets: {
                                'genes-router': ['gene-details', this.id],
                                'gene-overview': ['nom-details']
                            }
                        }, this.extras);
                        break;
                    case 'SUMMARY':
                        if (this.geneInfo.nominations) {
                            this.navService.setOvMenuTabIndex(1);
                        } else {
                            this.navService.setOvMenuTabIndex(0);
                        }
                        this.navService.goToRoute('/genes', {
                            outlets: {
                                'genes-router': ['gene-details', this.id],
                                'gene-overview': ['soe']
                            }
                        }, this.extras);
                        break;
                    case 'EVIDENCE':
                        if (this.geneInfo.nominations) {
                            this.navService.setOvMenuTabIndex(2);
                        } else {
                            this.navService.setOvMenuTabIndex(1);
                        }
                        this.navService.goToRoute('/genes', {
                            outlets: {
                                'genes-router': ['gene-details', this.id],
                                'gene-overview': ['rna']
                            }
                        }, this.extras);
                        break;
                    case 'DRUGGABILITY':
                        if (this.geneInfo.nominations) {
                            if (this.geneInfo.druggability) {
                                this.navService.setOvMenuTabIndex(3);
                            }
                        } else {
                            if (this.geneInfo.druggability) {
                                this.navService.setOvMenuTabIndex(2);
                            }
                        }
                        this.navService.goToRoute('/genes', {
                            outlets: {
                                'genes-router': ['gene-details', this.id],
                                'gene-overview': ['druggability']
                            }
                        }, this.extras);
                        break;
                    default:
                        this.navService.setOvMenuTabIndex(0);
                        this.navService.goToRoute('/genes', {
                            outlets: {
                                'genes-router': ['gene-details', this.id],
                                'gene-overview': ['nom-details']
                            }
                        }, this.extras);
                }
            }
        }
    }

    setActiveItem() {
        if (this.geneInfo) {
            this.activeItem = this.items[this.navService.getOvMenuTabIndex()];
        }
    }

    initTissuesModels() {
        // Check if we have a database id at this point
        if (this.gene) {
            if (!this.geneService.getPreviousGene() || this.geneService.hasGeneChanged()) {
                this.dataService.loadData(this.gene).subscribe((responseList) => {
                    // Genes response
                    this.dataService.loadGenes(responseList[0]);
                    this.geneService.loadGeneTissues(responseList[2]);
                    this.geneService.loadGeneModels(responseList[3]);

                    if (!this.geneInfo.nominations) {
                        this.items.splice(0, 1);
                    }
                    if (!this.geneInfo.druggability) {
                        this.items.splice(this.items.length - 1, 1);
                    }
                    this.setActiveItem();
                    this.dataLoaded = true;
                });
            } else {
                if (!this.geneInfo.nominations) {
                    this.items.splice(0, 1);
                }
                if (!this.geneInfo.druggability) {
                    this.items.splice(this.items.length - 1, 1);
                }
                this.setActiveItem();
                this.dataLoaded = true;
            }
        } else {
            this.geneService.setGeneTissues([]);
            this.geneService.setGeneModels([]);
            this.initDetails();
        }
    }

    initDetails() {
        if (this.geneService.hasGeneChanged()) {
            this.apiService.getGenes().subscribe((data: GenesResponse) => {
                this.dataService.loadGenes(data);
            }, (error) => {
                console.log('Error loading genes!');
            }, () => {
                this.setActiveItem();
                this.dataLoaded = true;
            });
        } else {
            this.setActiveItem();
            this.dataLoaded = true;
        }
    }

    getSummary(body: boolean): string {
        if (this.geneInfo.summary) {
            let finalString = '';
            const parenthesisArr = this.geneInfo.summary.split(/\(([^)]+)\)/g);
            if (parenthesisArr.length) {
                parenthesisArr.forEach((p, i, a) => {
                    // Add the parenthesis back
                    let auxString = '';
                    if (i > 0) {
                        auxString += (i % 2 === 1) ? '(' : ')';
                    }
                    if (i < a.length - 1) {
                        // Replace brackets with a space except the last one
                        finalString += auxString + p.replace(/\[[^)]*\]/g, ' ');
                    } else {
                        finalString += auxString + p;
                    }
                });
            }
            if (!finalString) { finalString = this.geneInfo.summary; }
            const bracketsArr = finalString.split(/\[([^)]+)\]/g);
            if (bracketsArr.length && bracketsArr.length > 1) {
                // We have brackets so get the description and ref back
                if (body) {
                    // Replace the spaces before and where the brackets were
                    // with nothing
                    return bracketsArr[0].replace(/  /g, '');
                } else {
                    // Return the last bracket string
                    if (bracketsArr[1].includes(',')) {
                        bracketsArr[1] = bracketsArr[1].split(',')[0];
                    }
                    return bracketsArr[1];
                }
            } else {
                // We dont have brackets so just get the description back
                if (body) {
                    return finalString;
                } else {
                    return '';
                }
            }
        } else {
            // If we don't have a summary, return a placeholder description and an empty ref
            if (body) {
                return 'No description';
            } else {
                return '';
            }
        }
    }

    viewSynapseReg() {
        this.navService.goToRoute('/synapse-account');
    }

    getAlias(): string {
        if (this.geneInfo.alias.length > 0) {
            return this.geneInfo.alias.join(', ');
        }
        return '';
    }

    getRNASeqLink(): string[] {
        return ['gene-rna-seq', this.gene.hgnc_symbol];
    }

    getCoExpNetLink(): string[] {
        return ['gene-coexp-network', this.gene.hgnc_symbol];
    }

    showDialog(dialogString: string) {
        this[dialogString] = true;
    }

    showDruggability() {
        window.open('https://www.synapse.org/#!Synapse:syn13363443', '_blank');
    }

    isNominatedTarget(): string {
        return (this.geneInfo && this.geneInfo.nominations) ? 'Yes' : 'No';
    }

    ngOnDestroy() {
        this.navService.setOvMenuTabIndex(0);
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
