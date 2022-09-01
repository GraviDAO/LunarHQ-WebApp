import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CssConstants } from 'src/app/shared/services/css-constants.service';

@Component({
  selector: 'app-why-lunar-hq-create-rule',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateRuleComponent implements OnInit {

  activeSubMenu = '';
  pageIndex = 1;
  createRuleForm: FormGroup;
  roles = [
    {
      id: 'shepards',
      name: 'Shepards',
    },
    {
      id: 'watchers',
      name: 'Watchers on the wall',
    },
    {
      id: 'dao',
      name: 'DAO Fellowship',
    },
    {
      id: 'x-men',
      name: 'X-Men 2.0',
    },
    {
      id: 'musketeers',
      name: 'The Musketeers',
    },
    {
      id: 'avengers',
      name: 'Avengers',
    },
    {
      id: 'gryfyndoor',
      name: 'Gryfyndoor',
    },
    {
      id: 'realworld',
      name: 'Realworld',
    }
  ]
  constructor(private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    public cssClass: CssConstants) {
        this.route.queryParams.subscribe((params: any) => {
        console.log(params.server);
        this.activeSubMenu = params.server;
      }); 
      this.createRuleForm = new FormGroup({
        name: new FormControl('',
          [
            Validators.required
          ]),
          description: new FormControl('',
          [
            Validators.required
          ])
      });
  }

  ngOnInit(): void {
  }

  navigateToMyServer() {
    this.router.navigate(['my-server']);
  }

  navigateBack() {
    this.location.back();
  }

  selectRule(rule: string) {

  }

  createRule() {

  }

  navigateNext() {
    
  }
}
