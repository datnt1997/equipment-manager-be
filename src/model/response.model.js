class Response {
  constructor({ errors = [], status = 200, response = {}, successful = true } = {}) {
    this.errors = errors
    this.status = status
    this.response = response
    this.successful = successful
  }

  toJson() {
    return { errors: this.errors, status: this.status, response: this.response, successful: this.successful }
  }
}

module.exports = Response;