
describe('/posts endpoint tests', () => {
    //státusz minden esetben ell
        it('Get all posts', () => {
            cy.api('/posts').its('status').should('eq', 200);
        });
    
       it('Get all pets response is an array', () => {
            cy.api('/posts').its('body').should('be.a', 'array');
        });

        it('GET /posts/{postId} - get one post by it is id - response status', () => {
            cy.api('/posts/1').its('status').should('eq', 200);
        });

        it('GET /posts/{postId} - get one post by it is id - response body', () => {
         
            cy.api({
                method: 'GET',
                url: '/posts/1',
                failOnStatusCode: false,
            }).then((post) => {
                cy.wrap(post.body).should('have.property', 'id').should('be.a', 'number');
                cy.wrap(post.body).should('have.property', 'title').should('be.a', 'string');
                cy.wrap(post.body).should('have.property', 'body').should('be.a', 'string');
                cy.wrap(post.body).should('have.property', 'userId').should('be.a', 'number');
            });
        })

        it('GET posts of 1 user - response status', () => {
            cy.api('/users/1/posts').its('status').should('eq', 200);
        });

        //todo:
        it('GET posts of 1 user - response body', () => {
            cy.api({
                method: 'GET',
                url: '/users/1/posts',
                failOnStatusCode: false,
            }).its('body').then((posts) => {
                for (const post of posts) {
                    cy.wrap(post).should('have.property', 'id').should('be.a', 'number');
                    cy.wrap(post).should('have.property', 'title').should('be.a', 'string');
                    cy.wrap(post).should('have.property', 'body').should('be.a', 'string');
                    cy.wrap(post).should('have.property', 'userId').should('be.a', 'number').should('eq', 1);
                }
            });
        })

        it('CREATE: create a new post - response status 200', () => {
            cy.api({
                method: 'POST',
                url: '/posts',
                failOnStatusCode: false,
                body: {
                    title: 'as',
                    body: 'dog',
                    userId: 3
                }
            }).then((response) => {
                cy.wrap(response.status).should('eq', 200);
            });
        });

        it('CREATE: create a new post - response body', () => {
            cy.api({
                method: 'POST',
                url: '/posts',
                failOnStatusCode: false,
                body: {
                    title: 'as',
                    body: 'dog',
                    userId: 3
                }
            }).then((response) => {
                cy.wrap(response.body).should('have.property', 'id').should('be.a', 'number');
            });
        });
        it('CREATE: attempt to create a post with missing parameters - expecting status 400 (currently 200 due to bug)', () => {
            cy.api({
                method: 'POST',
                url: '/posts',
                failOnStatusCode: false,
                body: {
                    title: 'post'
                }
            }).then((response) => {
                expect(response.status).should('eq', 400); 
            });
        });

        it('PUT update an existing post - response status', () => {
            cy.api({
                method: 'PUT',
                url: '/posts/1',
                failOnStatusCode: false,
                
            }).its('status').should('eq', 200);
        });

        it('PUT update an existing post - response body', () => {
            cy.api({
                method: 'PUT',
                url: '/posts/1',
                failOnStatusCode: false,
                body:{
                    title: 'Updated title',
                    body: 'Updated body',
                    userId: 1
                }
            }).then(post => {
                cy.wrap(post.status).should('eq', 200);
                cy.wrap(post.body).should('have.property', 'title').should('include', 'Updated Title');
                cy.wrap(post.body).should('have.property', 'body').should('include', 'Updated body');
                cy.wrap(post.body).should('have.property', 'userId').should('include', '1');
            });
        });

        it.only('DELETE delete post - response status', () => {
            cy.api({
                method: 'DELETE',
                url: '/posts/1',
                failOnStatusCode: false,
                
            }).its('status').should('eq', 200)
        });
   

       
     


       
    /*
        it('Get all pets response array consists of object', () => {
            cy.api('/list').its('body').then((pets) => {
                for (const pet of pets) {
                    cy.wrap(pet).should('be.a', 'object');
                }
            });
        });
    
        it('pet ', () => {
            cy.api('/1955').its('body');
        })
    
        it('pet status', () => {
            cy.api('/1955').its('status').should('eq', 200);
        })
    
        it('pet params', () => {
            cy.api('/1955').its('body').then((pet) => {
                //for(const pet of pets){
                cy.wrap(pet).should('have.property', 'name');
                cy.wrap(pet).should('have.property', 'age');
                cy.wrap(pet).should('have.property', 'type');
                cy.wrap(pet).should('have.property', 'new');
                cy.wrap(pet).should('have.property', 'highlighted');
                // }
            });
        })
    
        it('pet params types', () => {
            cy.api('/list').its('body').then((pets) => {
                for (const pet of pets) {
                    cy.wrap(pet).should('have.property', 'name').should('be.a', 'string');
                    cy.wrap(pet).should('have.property', 'age').should('be.a', 'number');
                    cy.wrap(pet).should('have.property', 'type').should('be.a', 'string');
                    cy.wrap(pet).should('have.property', 'new').should('be.a', 'boolean');
                    cy.wrap(pet).should('have.property', 'highlighted').should('be.a', 'boolean');
                }
            });
        })
    
        it('/999999', () => {
         
            cy.api({
                method: 'GET',
                url: '/999999',
                failOnStatusCode: false,
            }).its('status').should('eq', 404);
    
            cy.api({
                method: 'GET',
                url: '/999999',
                failOnStatusCode: false,
            }).its('body').then((pet) => {
                    cy.wrap(pet).should('not.have.property', 'name');
                    cy.wrap(pet).should('not.have.property', 'age')
                    cy.wrap(pet).should('not.have.property', 'type');
                    cy.wrap(pet).should('not.have.property', 'new');
                    cy.wrap(pet).should('not.have.property', 'highlighted');
              
            });
        })
    
        it('/_', () => {
         
            cy.api({
                method: 'GET',
                url: '/_',
                failOnStatusCode: false,
            }).its('status').should('eq', 400);
    
            cy.api({
                method: 'GET',
                url: '/_',
                failOnStatusCode: false,
            }).its('body').then((pet) => {
                    cy.wrap(pet).should('not.have.property', 'name');
                    cy.wrap(pet).should('not.have.property', 'age')
                    cy.wrap(pet).should('not.have.property', 'type');
                    cy.wrap(pet).should('not.have.property', 'new');
                    cy.wrap(pet).should('not.have.property', 'highlighted');
              
            });
        })
    
        it('/asd', () => {
         
            cy.api({
                method: 'GET',
                url: '/asd',
                failOnStatusCode: false,
            }).its('status').should('eq', 400);
    
            cy.api({
                method: 'GET',
                url: '/asd',
                failOnStatusCode: false,
            }).its('body').then((pet) => {
                    cy.wrap(pet).should('not.have.property', 'name');
                    cy.wrap(pet).should('not.have.property', 'age')
                    cy.wrap(pet).should('not.have.property', 'type');
                    cy.wrap(pet).should('not.have.property', 'new');
                    cy.wrap(pet).should('not.have.property', 'highlighted');
              
            });
    
            //ez ugyanaz, csak összevonva egy apival
            cy.api({
                method: 'GET',
                url: '/asd',
                failOnStatusCode: false,
            }).then((pet) => {
                cy.wrap(pet.status).should('eq', 400);
                cy.wrap(pet.body).should('not.have.property', 'name');
                cy.wrap(pet.body).should('not.have.property', 'age');
                cy.wrap(pet.body).should('not.have.property', 'type');
                cy.wrap(pet.body).should('not.have.property', 'new');
                cy.wrap(pet.body).should('not.have.property', 'highlighted');
            });
        })
    
        it('/', () => {
         
            cy.api({
                method: 'GET',
                url: '/',
                failOnStatusCode: false,
            }).its('status').should('eq', 404);
    
            cy.api({
                method: 'GET',
                url: '/',
                failOnStatusCode: false,
            }).its('body').then((pet) => {
                    cy.wrap(pet).should('not.have.property', 'name');
                    cy.wrap(pet).should('not.have.property', 'age')
                    cy.wrap(pet).should('not.have.property', 'type');
                    cy.wrap(pet).should('not.have.property', 'new');
                    cy.wrap(pet).should('not.have.property', 'highlighted');
              
            });
        })
    
        it.only('create', () => {
         
            cy.api({
                method: 'POST',
                url: '/create',
                failOnStatusCode: false,
                body: {
                    name: 'as',
                    age:1,
                    new: true,
                    type: 'dog',
                    highlighted: true
                }
            }).its('status').should('eq', 200).and().its('id').should('be.a', 'number')
            
        })
    
    */
    });