const qs = require('qs');

class APIFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const queryObj = qs.parse(this.queryObject);
    ['sort', 'limit', 'page', 'fields'].forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const fields = this.queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(fields);
    }
    return this;
  }

  limitFields() {
    if (this.queryObject.limit) {
      const fields = this.queryObject.limit.split(',').join(' ');
      this.query.select(fields);
    }
    return this;
  }

  paginate() {
    const page = this.queryObject.page * 1 || 1;
    const limit = this.queryObject.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
