const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddHoldings(data) {
  let errors = {};

  data.security = !isEmpty(data.security) ? data.security : '';
  data.accountId = !isEmpty(data.accountId) ? data.accountId : '';
  
  if (Validator.isEmpty(data.security)) {
    errors.security = 'Security Symbol field is required';
  }

  if (Validator.isEmpty(data.accountId)) {
    errors.accountId = 'Account Id field is required';
  }

  if (isEmpty(data.costBasis)) {
    errors.costBasis = 'Cost Basis field is required';
  } else if(isNaN(data.costBasis)) {
    errors.costBasis = 'Cost Basis should be a number';
  }

  if (isEmpty(data.quantity)) {
    errors.quantity = 'Quantity field is required';
  } else if(isNaN(data.quantity)) {
    errors.quantity = 'Quantity should be a number';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};