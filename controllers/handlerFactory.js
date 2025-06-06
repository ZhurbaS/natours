const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No document found with this ID ${req.params.id}`, 404),
      );
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOrUpdateOne = (Model, uniqueFields = []) =>
  catchAsync(async (req, res, next) => {
    const filter = {};
    for (let i = 0; i < uniqueFields.length; i++) {
      const field = uniqueFields[i];
      if (!req.body[field]) {
        return next(new AppError(`Missing unique field: ${field}`, 400));
      }
      filter[field] = req.body[field];
    }

    const existing = await Model.findOne(filter);

    if (existing) {
      // Оновлюємо лише надані поля
      Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] !== 'undefined') {
          existing[key] = req.body[key];
        }
      });
      const updated = await existing.save();

      return res.status(200).json({
        status: 'updated',
        data: {
          data: updated,
        },
      });
    }

    const created = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: created,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const filter = req.params.tourId ? { tour: req.params.tourId } : {};

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let { query } = features;
    if (popOptions) {
      query = query.populate(popOptions); // <== ОЦЕ ГОЛОВНЕ
    }

    // const doc = await query.explain();
    const doc = await query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
