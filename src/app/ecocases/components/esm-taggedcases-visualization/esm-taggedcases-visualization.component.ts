import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EsmsService } from '../../../esms/services/esms.service';
import { EcocasesService } from '../../services/ecocases.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-esm-taggedcases-visualization',
  templateUrl: './esm-taggedcases-visualization.component.html',
  styleUrls: ['./esm-taggedcases-visualization.component.scss']
})
export class EsmTaggedcasesVisualizationComponent implements OnInit {
  vis; simulation;
  color;
  node; nodeText; link; nodeIcon;
  width; height; div; centerNode;
  showNodeText; showLink;

  public esms: any[];
  public ecocases: any[];
  public d3ESMEcocases: {'nodes': any[], 'links': any[]};

  constructor(
    private es: EcocasesService,
    private esmss: EsmsService,
    private router: Router
  ) { }


  ngOnInit() {
    this.showNodeText = false;
    this.showLink = false;
    this.width = document.getElementById('esmEcocasesGraph').clientWidth;
    this.height = document.getElementById('esmEcocasesGraph').clientHeight;
    this.esmss.getESMs()
      .pipe(
        map(res => {
          console.log('esmsssssssssssss:', res['data'].esms);
          this.esms = res['data'].esms;
          this.esmss.getTaggedEcocasesByESM(this.esms[0].id)
            .pipe(
              map(res => {
                console.log('esms-visualization => clickESM => res ', res);
                this.ecocases = res['data'].ecocases;
                this.d3ESMEcocases = this.getD3ESMEcocases(this.esms[0], this.ecocases, this.width, this.height);
                console.log('esms-visualization => clickESM => d3ESMEcocases ', this.d3ESMEcocases);
                this.displayD3Graph(this.d3ESMEcocases, 'esmEcocasesGraph');
              }))
            .subscribe();
        }))
      .subscribe();
  }

  clickESM(esm: any): any {
    console.log('click ESM: ', esm);
    this.esmss.getTaggedEcocasesByESM(esm.id)
      .pipe(
        map(res => {
          console.log('esms-visualization => clickESM => res ', res);
          this.ecocases = res['data'].ecocases;
          this.d3ESMEcocases = this.getD3ESMEcocases(esm, this.ecocases, this.width, this.height);
          console.log('esms-visualization => clickESM => d3ESMEcocases ', this.d3ESMEcocases);
          this.displayD3Graph(this.d3ESMEcocases, 'esmEcocasesGraph');
        }))
      .subscribe();
  }

  getD3ESMEcocases(esm, ecocases, width, height) {
    let nodes = [], links = [];
    nodes.push({'id': esm.id.toString(), 'title': esm.title, 'group': 1, 'x': width/2, 'y': height/2, 'r': 25, 'fx': width/2, 'fy': height/2, 'iconURL': esm.logo_url});
    ecocases.forEach((ecocase, index) => {
      nodes.push({
        'id': ecocase.id.toString(),
        'title': ecocase.title,
        'group': 2, // esm is tagged as the 1st mechanism
        'r': ecocase.first_esm_count * 10,
        'x': Math.random() * width / 2 + width / 2,
        'y': Math.random() * height,
        'fx': Math.random() * width / 2 + width / 2,
        'fy': Math.random() * height,
        'iconURL': ''
      });
      nodes.push({
        'id': ecocase.id.toString(),
        'title': ecocase.title,
        'group': 3, // esm is tagged as the 2nd mechanism
        'r': ecocase.second_esm_count * 10,
        'x': Math.random() * width / 2,
        'y': Math.random() * height,
        'fx': Math.random() * width / 2,
        'fy': Math.random() * height,
        'iconURL': ''
      });
      if (this.showLink) { links.push({'source': esm.id, 'target': ecocase.id, 'value': 1}) };
    });
    return {'nodes': nodes, 'links': links};
  }

  displayD3Graph(d3Data, graphDiv) {
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.centerNode = d3Data.nodes[0];

    d3.select('#d3'+graphDiv).select('#idD3'+graphDiv).remove();
    this.vis = d3.select('#d3'+graphDiv)
      .classed('svg-container',true).append('svg:svg').attr('preserveAspectRatio','xMinYMin meet').attr('viewBox','-50 -70 800 500').classed('svg-content-responsive',true)
      .attr('id','idD3'+graphDiv).attr('width',this.width).attr('height',this.height).attr('pointer-events','all')

    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d['id']))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width/2, this.height/2))
      .force('y', d3.forceY(0))
      .force('x', d3.forceX(0));

    this.render(d3Data, graphDiv);
  }

  ticked() {
    this.link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    this.node
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);

    this.nodeIcon
      .attr('x', (d) => d.x - 25)
      .attr('y', (d) => d.y - 25);

    if (this.showNodeText) {
      this.nodeText
        .attr('x', function(d){ return d.x; })
        .attr('y', function (d) {return d.y - 10; });
    };
  }

  render(graph, graphDiv){
    this.link = this.vis.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('stroke', 'red')
      .attr('stroke-width', (d) => Math.sqrt(d.value));

    this.node = this.vis.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter().filter(function(d) { return d.iconURL === ''; })
      .append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', (d) => this.color(d.group))
      .call(d3.drag()
        .on('start', (d) => this.dragstarted(d))
        .on('drag', (d) => this.dragged(d))
        .on('end', (d) => this.dragended(d)))
      .on('click', (d) => {
        console.log(d);
        if (d.group !== 1) this.router.navigate([`ecocases/detail/${d.id}`]);
      })
      .on('mouseover', (d) => this.onmouseover(d, graphDiv))
      .on('mouseout', (d) => this.onmouseout(graphDiv))
    ;

    if (this.showNodeText) {
      this.nodeText = this.vis.selectAll('.nodeText')
      .data(graph.nodes)
      .enter()
      .append('text')
      .attr('dx',12).attr('dy','.35em')
      .text((d) => d.title.length > 30 ? d.title.substring(0, 30) + '...' : d.title)
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-family', 'Arial')
      .style('font-size', 15)
      .on('click', (d) => {
        console.log(d);
        if (d.group !== 1) { this.router.navigate([`ecocases/detail/${d.id}`]); }
      });
    }

    this.nodeIcon = this.vis.selectAll('.nodeIcon')
      .data(graph.nodes)
      .enter()
      .filter(function(d) { return d.iconURL !== ''; })
      .append('image')
      .attr('xlink:href', (d) => d.iconURL)
      .attr('x', '-12px')
      .attr('y', '-44px')
      .attr('width', '50px')
      .attr('height', '50px')
      .on('click', (d) => {
        console.log(d);
        if (d.group !== 1) this.router.navigate([`mechanisms`]);
      })
      .on('mouseover', (d) => this.onmouseover(d, graphDiv))
      .on('mouseout', (d) => this.onmouseout(graphDiv));

    this.simulation
      .nodes(graph.nodes)
      .on('tick', () => {return this.ticked()});

    this.simulation.force('link')
      .links(graph.links);
  }

  dragstarted(d) {
    d.fx = null; d.fy = null;
  }

  dragged(d) {
    d.x = d3.event.x; d.y = d3.event.y;
  }

  dragended(d) {
    d.fx = d3.event.x; d.fy = d3.event.y;
  }

  onmouseover(d, graphDiv) {
    this.div = d3.select('#d3' + graphDiv).append('div')
      .attr('class', 'tooltip')
      .attr('id', 'idTooltip');

    console.log(d);

    this.div.transition()
      .duration(50)
      .style('opacity', .9)
      .style('left', d.x + 'px')
      .style('top', d.y - 25 + 'px');

    this.div.html('<p>' + d.title + '</p>');
  }

  onmouseout(graphDiv) {
    d3.select('#d3' + graphDiv).select('#idTooltip').remove();
  }
}
