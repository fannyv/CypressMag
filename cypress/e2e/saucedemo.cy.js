describe('SauceDemo E2E Tests', () => {
      beforeEach(() => {
          cy.visit('https://www.saucedemo.com/');
      });
  
      it('Se connecter et ajouter un produit au panier', () => {
          // Connexion avec un utilisateur valide
          cy.get('[data-test="username"]').type('standard_user');
          cy.get('[data-test="password"]').type('secret_sauce');
          cy.get('[data-test="login-button"]').click();
  
          // Vérifier que la connexion est réussie
          cy.url().should('include', '/inventory.html');
          cy.contains('Products').should('be.visible');
  
          // Ajouter le premier produit au panier
          cy.get('.inventory_item').first().within(() => {
              cy.get('.btn_inventory').click();
          });
  
          // Vérifier que l'icône du panier indique 1 produit
          cy.get('.shopping_cart_badge').should('contain', '1');
      });
  
      it('Vérifier le panier et finaliser la commande', () => {
          // Connexion
          cy.get('[data-test="username"]').type('standard_user');
          cy.get('[data-test="password"]').type('secret_sauce');
          cy.get('[data-test="login-button"]').click();
  
          // Ajouter un produit
          cy.get('.inventory_item').first().within(() => {
              cy.get('.btn_inventory').click();
          });
  
          // Aller au panier
          cy.get('.shopping_cart_link').click();
          cy.url().should('include', '/cart.html');
  
          // Vérifier la présence du produit dans le panier
          cy.get('.cart_item').should('have.length', 1);
          
          // Procéder au checkout
          cy.get('[data-test="checkout"]').click();
          cy.url().should('include', '/checkout-step-one.html');
  
          // Remplir les informations du client
          cy.get('[data-test="firstName"]').type('John');
          cy.get('[data-test="lastName"]').type('Doe');
          cy.get('[data-test="postalCode"]').type('75001');
          cy.get('[data-test="continue"]').click();
  
          // Vérifier l'étape finale et terminer l'achat
          cy.get('[data-test="finish"]').click();
          cy.contains('Thank you for your order!').should('be.visible');
      });
  
      it('Se déconnecter de l application', () => {
          // Connexion
          cy.get('[data-test="username"]').type('standard_user');
          cy.get('[data-test="password"]').type('secret_sauce');
          cy.get('[data-test="login-button"]').click();
  
          // Ouvrir le menu et cliquer sur Logout
          cy.get('#react-burger-menu-btn').click();
          cy.get('#logout_sidebar_link').click();
  
          // Vérifier que l'on est bien déconnecté
          cy.url().should('include', '/');
          cy.get('[data-test="login-button"]').should('be.visible');
      });

      it('Se connecter avec problem_user et vérifier les bugs potentiels', () => {
        // Connexion
        cy.get('[data-test="username"]').type('problem_user');
        cy.get('[data-test="password"]').type('secret_sauce');
        cy.get('[data-test="login-button"]').click();

        // Vérifier la connexion réussie en contrôlant l'URL
        cy.url().should('include', '/inventory.html');

        // Vérifier si les images des produits sont bien affichées
        cy.get('.inventory_item_img').each(($img) => {
            cy.wrap($img).should('be.visible');
        });

        // Vérifier que les boutons d'ajout au panier sont bien cliquables
        cy.get('.btn_inventory').each(($btn) => {
            cy.wrap($btn).should('be.visible').and('be.enabled');
        });

        // Vérifier la cohérence des produits affichés
        cy.get('.inventory_item').should('have.length', 6);

        // Ajouter un produit au panier
        cy.get('.inventory_item').first().find('.btn_inventory').click();

        // Vérifier que l'icône du panier est mise à jour
        cy.get('.shopping_cart_badge').should('be.visible').and('contain', '1');

        // Aller sur la page du panier
        cy.get('.shopping_cart_link').click();
        cy.url().should('include', '/cart.html');

        // Vérifier que le produit ajouté est bien dans le panier
        cy.get('.cart_item').should('have.length', 1);

        // Tenter de passer la commande
        cy.get('[data-test="checkout"]').click();
        cy.url().should('include', '/checkout-step-one.html');

        // Remplir les informations de commande
        cy.get('[data-test="firstName"]').type('Test');
        cy.get('[data-test="lastName"]').type('User');
        cy.get('[data-test="postalCode"]').type('75000');
        cy.get('[data-test="continue"]').click();

        // Vérifier la présence des éléments de la commande
        cy.url().should('include', '/checkout-step-two.html');
        cy.get('.cart_item').should('have.length', 1);

    });
  });
  