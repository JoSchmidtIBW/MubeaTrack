class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //1a) FILTERING...
  filter() {
    // 1a) Filtering
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'fields']; // this you not want in query,
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1b) advanced FILTERING
    let queryStr = JSON.stringify(queryObj); // has to be LET

    // Input dollar-sign
    // gte, gt, lte, lt
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // 2) SORTING
  sort() {
    if (this.queryString.sort) {

      const sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);

    } else {
      this.query = this.query.sort('-createdAt'); // default, when user not sort
    }

    return this;
  }

  //3) FIELD limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('__v');
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //4) PAGINATION
    // 1-10 -> page 1, 11-20 --> page 2   21-30 --> page 3
    //page=3&limit=10
    const page = this.queryString.page * 1 || 1; // make a number // by default 1
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit; // page 30 --> 21-30 --> 2* 10 -1

    //query = query.skip(10).limit(10)
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
