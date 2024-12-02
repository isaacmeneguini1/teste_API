/// <reference types="cypress" />
import contrato from '../contracts/usuario.contract'
import { faker } from '@faker-js/faker'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios',
          }).then(response => {
               contrato.validateAsync(response.body);
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios',
          }).then(response => {
               expect(response.status).to.equal(200);
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `Usuario Teste ${Math.floor(Math.random() * 1000000)}`
          cy.cadastrarUsuario1(token, usuario, faker.internet.email(), faker.internet.password(), 'false')
               .then((response) => {
                    expect(response.status).to.equal(201)
                    expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuarios("Fulano da Silva", "fulano@qa.com", "teste", "true")
               .then(response => {
                    expect(response.status).to.equal(400);
                    expect(response.body.message).to.equal("Este email já está sendo usado")
               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let usuario = `Usuario Teste ${Math.floor(Math.random() * 1000000)}`
          cy.cadastrarUsuario1(token, usuario, faker.internet.email(), faker.internet.password(), 'false')
               .then(response => {
                    let id = response.body._id

                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body:
                         {
                              "nome": usuario,
                              "email": faker.internet.email(),
                              "password": faker.internet.password(),
                              "administrador": 'false'
                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `Usuario Teste ${Math.floor(Math.random() * 1000000)}`
          cy.cadastrarUsuario1(token, usuario, faker.internet.email(), faker.internet.password(), 'false')
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                         headers: { authorization: token }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                    })
               })
     });


});
