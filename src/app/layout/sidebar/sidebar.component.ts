import { Component, OnInit, ElementRef, NgModule, ViewContainerRef, Compiler, ComponentFactory, ComponentRef, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AppConfig } from '../../app.config';
import { SidebarService } from './sidebar.service';
import { Helpers } from './../../helper';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping } from 'angular2-tree-component';
declare var jQuery: any;


@Component({
  selector: '[sidebar]',
  templateUrl: './sidebar.template.html',
  styleUrls: ['styles.scss'],
  providers: [SidebarService]
})

export class Sidebar implements OnInit {
  @ViewChild('mymenu', {
    read: ViewContainerRef
  }) target: ViewContainerRef;
  @ViewChild('tree') tree;
  private cmpRef: ComponentRef<any>;

  $el: any;
  config: any;
  router: Router;
  location: Location;
  private nodes: any;
  constructor(config: AppConfig, el: ElementRef, router: Router, location: Location,
    private compiler: Compiler,
    private _viewContainerRef: ViewContainerRef,
    private sidebarservice: SidebarService) {
    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();
    this.router = router;
    this.location = location;
    this.sidebarservice.getMenu().subscribe(data => {
      this.nodes = data;
      console.log(data);
    })
  }

  clickedNode() {
    console.log(this.tree);
    if (this.tree.treeModel.nodes.length) {
      this.tree.treeModel.getFocusedNode().toggleExpanded()
    }
  }
  onEvent($event) {
    let data: any = $event.node.data;
    let hasChildren: boolean = $event.node.hasChildren;
    if (!hasChildren) {
      this.router.navigate([`app/${data.slug}`])
    }
  }
  initSidebarScroll(): void {
    let $sidebarContent = this.$el.find('.js-sidebar-content');
    if (this.$el.find('.slimScrollDiv').length !== 0) {
      $sidebarContent.slimscroll({
        destroy: true
      });
    }
    $sidebarContent.slimscroll({
      height: window.innerHeight,
      size: '4px'
    });
  }

  changeActiveNavigationItem(location): void {
    let $newActiveLink = this.$el.find('a[href="#' + location.path() + '"]');

    // collapse .collapse only if new and old active links belong to different .collapse
    if (!$newActiveLink.is('.active > .collapse > li > a')) {
      this.$el.find('.active .active').closest('.collapse').collapse('hide');
    }
    this.$el.find('.sidebar-nav .active').removeClass('active');

    $newActiveLink.closest('li').addClass('active')
      .parents('li').addClass('active');

    // uncollapse parent
    $newActiveLink.closest('.collapse').addClass('in')
      .siblings('a[data-toggle=collapse]').removeClass('collapsed');
  }

  ngOnInit(): void {
    jQuery(window).on('sn:resize', this.initSidebarScroll.bind(this));
    this.initSidebarScroll();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.changeActiveNavigationItem(this.location);
      }
    });
  }

  getIdUsuario() {
    let session = Helpers.getJsonSession();
    console.log(session[0]['id_usuario'])
    return session[0]['id_usuario'] || '';
  }

  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
      this.cmpRef = null;
    }
  }

}