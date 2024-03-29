import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

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
  ];
  rules = [
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
  ];
  ruleTypes = [
    // Commented based on call with Adam
    /*{
      id: 'existing_rule',
      name: 'EXISTING RULE',
    },*/
    {
      id: 'nft',
      name: 'NFT',
    },
    {
      id: 'token',
      name: 'TOKEN',
    },
    // {
    //   id: 'complex',
    //   name: 'COMPLEX',
    // }
  ];
  conditions = [
    {
      id: 'is',
      name: 'IS',
    },
    {
      id: 'not',
      name: 'NOT',
    },
    {
      id: 'and',
      name: 'AND',
    },
    {
      id: 'or',
      name: 'OR',
    }
  ];

  operators = [
    {
      id: 'Greater Than Or Equals',
      name: '≥',
    },
    {
      id: 'Greater Than',
      name: '>',
    },
    {
      id: 'Equals',
      name: '=',
    },
    {
      id: 'Lesser Than',
      name: '<',
    },
    {
      id: 'Lesser Than Or Equals',
      name: '≤',
    }/*,
    {
      id: 'not_equals',
      name: '!=',
    }*/
  ];
  traitTypes = [
    {
      id: 'headwear',
      name: 'HEADWEAR',
    },
    {
      id: 'clothes',
      name: 'CLOTHES',
    },
    {
      id: 'background',
      name: 'BACKGROUND',
    }
  ];
  traitRows = [
    {
      id: 'halo',
      name: 'HALO',
    },
    {
      id: 'sushi',
      name: 'SUSHI',
    },
    {
      id: 'gborg',
      name: 'GBORG',
    },
    {
      id: 'mars',
      name: 'MARS',
    }
  ]

  constructor() {
  }

  getRoles() {
    return this.roles;
  }

  getRole(roleId: string) {
    return this.roles.find((role) => role.id === roleId)
  }

  getRules() {
    return this.rules;
  }

  getRule(ruleId: string) {
    return this.rules.find((rule) => rule.id === ruleId);
  }

  getRuleTypes() {
    return this.ruleTypes;
  }

  getRuleType(ruleTypeId: string) {
    return this.ruleTypes.find((ruleType) => ruleType.id === ruleTypeId);
  }

  getConditions() {
    return this.conditions;
  }

  getCondition(conditionId: string) {
    return this.conditions.find((condition) => condition.id === conditionId);
  }

  getOperators() {
    return this.operators;
  }

  public getOperator(operatorId: string) {
    return this.operators.find((operator) => operator.id === operatorId);
  }

  getTraitTypes() {
    return this.traitTypes;
  }

  getTraitType(traitTypeId: string) {
    return this.traitTypes.find((traitType) => traitType.id === traitTypeId);
  }

  getTraitRows() {
    return this.traitRows;
  }

  getTraitRow(traitRowId: string) {
    return this.traitRows.find((traitRow) => traitRow.id === traitRowId);
  }
}
