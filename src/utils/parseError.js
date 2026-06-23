export function parseError(err) {
  if (!err.response) {
    return 'Network error — please check your connection and try again.';
  }
  if (err.response.status === 404) {
    return 'Product not found.';
  }
  if (err.response.status >= 500) {
    return 'Server error — please try again later.';
  }
  return 'Something went wrong. Please try again.';
}
