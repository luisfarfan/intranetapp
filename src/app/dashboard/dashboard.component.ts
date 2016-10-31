import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceMenu } from './service';
@Component({
  selector: 'another',
  template: `<Tree [nodes]="nodes" (onToggle)="onEvent($event)"
    (onActiveChanged)="onEvent($event)"
    (onFocus)="onEvent($event)"
    (onBlur)="onEvent($event)"></Tree>`,
  providers: [ServiceMenu]
})
export class Dashboard {
  private nodes: any;
  constructor(private service: ServiceMenu, private router: Router) {
    this.service.getMenu().subscribe(data => {
      this.nodes = data;
      console.log(data);
    })
  }
  onEvent($event) {
    let data: any = $event.node.data;
    console.log(data.slug)
    
    if (!data.children.length) {
      this.router.navigate([`app/${data.slug}`])
    }
  }
}


