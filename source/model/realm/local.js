import _ from 'lodash';

const reparg = (op, a0, a1, a2) => {
  op = op.replace('$0', a0);
  op = op.replace('$1', a1);
  op = op.replace('$2', a2);
  return op;
};
const getkv = (op, a0, a1, a2) => {
  op = reparg(op, a0, a1, a2);

  const res = {};
  const pairs = op.split('==');
  if (pairs && pairs.length === 2) {
    res.op = '==';
  }
  if (pairs && pairs.length === 2) {
    res.key = pairs[0].trim();
    res.value = pairs[1].trim();
    if (res.value && res.value.length && res.value[0] === '\'' &&
        res.value[res.value.length - 1] === '\'') {
      res.value = res.value.substring(1, res.value.length - 1);
    }
    if (res.value && res.value.length && res.value[0] === '"' &&
        res.value[res.value.length - 1] === '"') {
      res.value = res.value.substring(1, res.value.length - 1);
    }
  }
  return res;
};

class RealmArray extends Array {
  filtered = (f, a0, a1, a2) => {
    let res = this;

    let pairs1 = f.split('&&');
    if (!pairs1 || !pairs1.length) {
      pairs1 = [f];
    }

    _.each(pairs1, (p1) => {
      let pairs2 = p1.split('||');
      if (!pairs2 || !pairs2.length) {
        pairs2 = [p1];
      }

      const resand = new RealmArray();
      let resorg = new RealmArray();
      _.each(res, r => resorg.push(r));

      _.each(pairs2, (p2) => {
        const kv = getkv(p2, a0, a1, a2);
        const arr1 = new RealmArray();

        _.each(resorg, (r) => {
          if (!r) return;
          if (kv.op === '==' && r[kv.key] === kv.value) {
            resand.push(r);
          } else if (kv.op === '>=' && r[kv.key] >= kv.value) {
            resand.push(r);
          } else if (kv.op === '>' && r[kv.key] > kv.value) {
            resand.push(r);
          } else if (kv.op === '<=' && r[kv.key] <= kv.value) {
            resand.push(r);
          } else if (kv.op === '<' && r[kv.key] < kv.value) {
            resand.push(r);
          } else if (kv.op === '!=' && r[kv.key] !== kv.value) {
            resand.push(r);
          } else {
            arr1.push(r);
          }
        });
        resorg = arr1;
      });
      res = resand;
    });

    return res;
  }

  sorted = (key, asc) => {
    const res = new RealmArray();
    const res1 = _.orderBy(this, [key], [asc ? 'asc' : 'desc']);
    _.each(res1, r => res.push(r));
    return res;
  }
}

class Realm {
  constructor(option) {
    const schemas = option.schema;

    this.tables = {};

    _.each(schemas, (schema) => {
      this.tables[schema.name] = {
        schema,
        data: {},
      };
    });
  }

  write = (cb) => {
    cb();
  }

  create = (tname, obj) => {
    const table = this._table2(tname, obj);
    if (!table) return;

    const found = table.data[table.oid];
    if (found) {
      table.data[table.oid] = {
        ...found,
        ...table.obj,
      };
    } else {
      table.data[table.oid] = table.obj;
    }

    // console.log('create', tname, obj, table);
  }

  delete = (tname, obj) => {
    const table = this._table1(tname);
    if (!table || !obj) return;

    if (obj.length) {
      _.each(obj, (o) => {
        const oid = o && o[table.prkey];
        if (oid) {
          table.data[oid] = null;
        }
      });
    } else {
      const oid = obj && obj[table.prkey];
      if (oid) {
        table.data[oid] = null;
      }
    }

    // console.log('delete', tname, obj, table);
  }

  objects = (tname) => {
    const arr = new RealmArray();
    const table = this._table1(tname);
    if (!table) return arr;

    _.each(table.data, v => arr.push(v));
    return arr;
  }

  _table1 = (tname) => {
    const table = this.tables[tname];
    if (!table) return null;
    const prkey = table.schema.primaryKey;
    return {
      schema: table.schema,
      data: table.data,
      prkey,
    };
  }

  _table2 = (tname, obj) => {
    const table = this.tables[tname];
    if (!obj || !table) return null;

    const prkey = table.schema.primaryKey;
    const oid = obj[prkey];
    if (!oid) return null;

    return {
      schema: table.schema,
      data: table.data,
      prkey, oid, obj,
    };
  }
}

export default Realm;
