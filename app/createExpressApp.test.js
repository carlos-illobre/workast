describe('Create Express Application', function () {

  it('Returns 404 if the url does not exist', function() {
    return this.request.get('/some/invalid/url').expect(404, {})
  })

})

