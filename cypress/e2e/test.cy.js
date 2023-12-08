describe("/posts endpoint tests", () => {
  it("Get all posts", () => {
    cy.api("/posts").its("status").should("eq", 200);
  });

  it("Get all pets response is an array", () => {
    cy.api("/posts").its("body").should("be.a", "array");
  });

  it("GET /posts/{postId} - get one post by it is id - existing id - response status", () => {
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

  it("GET /posts/{postId} - get one post by it is id - non-existent id - response status", () => {
    cy.api({
      method: "GET",
      url: "/posts/9999999",
      failOnStatusCode: false,
    })
      .its("status")
      .should("eq", 404);
  });

  it("GET /posts/{postId} - get one post by it is id - non-existent id - response body", () => {
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

  it("GET posts of 1 user - response status", () => {
    cy.api("/users/1/posts").its("status").should("eq", 200);
  });

  //todo:
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

  it("CREATE: create a new post - response status 200", () => {
    cy.api({
      method: "POST",
      url: "/posts",
      failOnStatusCode: false,
      body: {
        title: "as",
        body: "dog",
        userId: 3,
      },
    }).then((response) => {
      cy.wrap(response.status).should("eq", 200);
    });
  });

  it("CREATE: create a new post - response body", () => {
    cy.api({
      method: "POST",
      url: "/posts",
      failOnStatusCode: false,
      body: {
        title: "as",
        body: "dog",
        userId: 3,
      },
    }).then((post) => {
      cy.wrap(post.body).should("have.property", "id").should("be.a", "number");
    });
  });
  it("CREATE: attempt to create a post with missing parameters - expecting status 400 (currently 200 due to bug)", () => {
    cy.api({
      method: "POST",
      url: "/posts",
      failOnStatusCode: false,
      body: {
        body: "post",
      },
    }).then((post) => {
      //The API has a bug as it will give back 200, but this test should be written as it is expecting a 400!
      cy.wrap(post.status).should("eq", 400);
    });
  });

  it("PUT update an existing post - response status", () => {
    cy.api({
      method: "PUT",
      url: "/posts/1",
      failOnStatusCode: false,
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
        userId: 1,
      },
    }).then((post) => {
      cy.wrap(post.status).should("eq", 200);
      cy.wrap(post.body)
        .should("have.property", "title")
        .should("include", "Updated title");
      cy.wrap(post.body)
        .should("have.property", "body")
        .should("include", "Updated body");
      cy.wrap(post.body).should("have.property", "userId").should("eq", 1);
    });
  });

  it("DELETE delete post - response status", () => {
    cy.api({
      method: "DELETE",
      url: "/posts/1",
      failOnStatusCode: false,
    })
      .its("status")
      .should("eq", 200);
  });
});
