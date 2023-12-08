describe("/posts endpoint tests", () => {
  
  context('GET/posts', () => {
    it("List all posts - response status", () => {
      cy.api("/posts").its("status").should("eq", 200);
    });

    it("Get all posts response is an array", () => {
      cy.api("/posts").its("body").should("be.a", "array");
    });
  })

  
  context('GET/posts', () => {
    it("GET get one post by it is id - existing id - response status", () => {
      cy.api("/posts/1").its("status").should("eq", 200);
    });

    it("GET /posts/{postId} - get one post by it is id - existing id - response body", () => {
      cy.api("/posts/1").then((post) => {
        cy.wrap(post.body).should("have.property", "id").should("be.a", "number");
        cy.wrap(post.body)
          .should("have.property", "title")
          .should("be.a", "string");
        cy.wrap(post.body)
          .should("have.property", "body")
          .should("be.a", "string");
        cy.wrap(post.body)
          .should("have.property", "userId")
          .should("be.a", "number");
      });
    });

    it(`GET /posts/{postId} - get one post by it's id - non-existent id - response status`, () => {
      cy.api({
        method: "GET",
        url: "/posts/9999999",
        failOnStatusCode: false,
      })
        .its("status")
        .should("not.eq", 200);
    });

    it(`GET /posts/{postId} - get one post by it's id - non-existent id - response body`, () => {
      cy.api({
        method: "GET",
        url: "/posts/9999999",
        failOnStatusCode: false,
      })
        .its("body")
        .then((post) => {
          cy.wrap(post).should("not.have.property", "id");
          cy.wrap(post).should("not.have.property", "title");
          cy.wrap(post).should("not.have.property", "body");
          cy.wrap(post).should("not.have.property", "userId");
        });
    });

    it(`GET /posts/{postId} - get one post by it's id - negative id - response status`, () => {
      cy.api({
        method: "GET",
        url: "/posts/-1",
        failOnStatusCode: false,
      })
        .its("status")
        .should("not.eq", 200);
    });

    it(`GET /posts/{postId} - get one post by it's id - negative id - response body`, () => {
      cy.api({
        method: "GET",
        url: "/posts/-1",
        failOnStatusCode: false,
      })
        .its("body")
        .then((post) => {
          cy.wrap(post).should("not.have.property", "id");
          cy.wrap(post).should("not.have.property", "title");
          cy.wrap(post).should("not.have.property", "body");
          cy.wrap(post).should("not.have.property", "userId");
        });
    });
  });

  
  context('GET/users/{userId}/posts', () => {
    it("GET - get all posts of 1 user - response status", () => {
      cy.api("/users/1/posts").its("status").should("eq", 200);
    });

    it("GET posts of 1 user - response body", () => {
      cy.api("/users/1/posts")
        .its("body")
        .then((posts) => {
          for (const post of posts) {
            cy.wrap(post).should("have.property", "id").should("be.a", "number");
            cy.wrap(post)
              .should("have.property", "title")
              .should("be.a", "string");
            cy.wrap(post)
              .should("have.property", "body")
              .should("be.a", "string");
            cy.wrap(post)
              .should("have.property", "userId")
              .should("be.a", "number")
              .should("eq", 1);
          }
        });
    });
    
  });

  
  context('POST/posts', () => {
    it("POST - create a new post - response status 200", () => {
      cy.api({
        method: "POST",
        url: "/posts",
        failOnStatusCode: false,
        body: {
          title: "testTitle",
          body: "testBody",
          userId: 3,
        },
      }).then((post) => {
        //The API has a bug as it will give back 201, but this test should be written as it is expecting a 200!
        cy.wrap(post.status).should("eq", 200);
      });
    });

    it("POST - create a new post - response body", () => {
      cy.api({
        method: "POST",
        url: "/posts",
        failOnStatusCode: false,
        body: {
          title: "testTitle",
          body: "testBody",
          userId: 3,
        },
      }).then((post) => {
        cy.wrap(post.body).should("have.property", "id").should("be.a", "number");
      });
    });

    it("POST - create a post without parameters - expecting status 400", () => {
      cy.api({
        method: "POST",
        url: "/posts",
        failOnStatusCode: false,
        body: {
        },
      }).then((post) => {
        //The API has a bug as it will give back 201, but this test should be written as it is expecting a 400!
        cy.wrap(post.status).should("eq", 400);
      });
    });

    it('POST - create a new post without title - expecting status 400', () => {
      cy.api({
        method: 'POST',
        url: '/posts',
        failOnStatusCode: false,
        body: {
          // title is missing
          body: 'testBody',
          userId: 1,
        },
      }).then((post) => {
        //The API has a bug as it will give back 201, but this test should be written as it is expecting a 400!
          cy.wrap(post.status).should("eq", 400);
      });
    });

    it('POST - create a new post with invalid userId - expecting status 400', () => {
      cy.api({
        method: 'POST',
        url: '/posts',
        failOnStatusCode: false,
        body: {
          title: 'testTitle',
          body: 'testBody',
          userId: -5, // negative id
        },
      }).then((post) => {
        //The API has a bug as it will give back 201, but this test should be written as it is expecting a 400!
          cy.wrap(post.status).should("eq", 400);
      });
    });

    it('POST - create a new post without body - expecting status 400', () => {
      cy.api({
        method: 'POST',
        url: '/posts',
        failOnStatusCode: false,
        body: {
          title: 'testTitle',
          // body is missing
          userId: 1,
        },
      }).then((post) => {
        //The API has a bug as it will give back 201, but this test should be written as it is expecting a 400!
          cy.wrap(post.status).should("eq", 400);
      });
    });
    
  });

  
  context('PUT/posts/{postId}', () => {
    it("PUT - update an existing post - response status", () => {
      cy.api({
        method: "PUT",
        url: "/posts/1",
        failOnStatusCode: false,
        body: {
          title: "U title",
          body: "U body",
          userId: 2,
        },
      })
        .its("status")
        .should("eq", 200);
    });

    it("PUT update an existing post - response body", () => {
      cy.api({
        method: "PUT",
        url: "/posts/1",
        failOnStatusCode: false,
        body: {
          title: "Updated title",
          body: "Updated body",
          userId: 3,
        },
      }).then((post) => {
        cy.wrap(post.status).should("eq", 200);
        cy.wrap(post.body)
          .should("have.property", "title")
          .should("include", "Updated title");
        cy.wrap(post.body)
          .should("have.property", "body")
          .should("include", "Updated body");
        cy.wrap(post.body).should("have.property", "userId").should("eq", 3);
      });
    });  
  });

  
  context('DELETE/posts/{postId}', () => {
    it("DELETE - delete post - response status", () => {
      cy.api({
        method: "DELETE",
        url: "/posts/1",
        failOnStatusCode: false,
      })
        .its("status")
        .should("eq", 200);
    });
  });
});
