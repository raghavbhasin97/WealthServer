const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddHoldings(data) {
  let errors = {};

  data.securityId = !isEmpty(data.securityId) ? data.securityId : '';
  data.costBasis = !isEmpty(data.costBasis) ? data.costBasis : '';
  data.quantity = !isEmpty(data.quantity) ? data.quantity : '';

  if (Validator.isEmpty(data.securityId)) {
    errors.securityId = 'Security Id field is required';
  }

  if (Validator.isEmpty(data.costBasis)) {
    errors.costBasis = 'Cost Basis field is required';
  }

  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = 'Quantity field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};