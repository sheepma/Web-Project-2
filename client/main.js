/* JavaScript Task Maneger - 2017, Mateus Lins Aceto */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Acc = new Mongo.Collection("acc");

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    template: 'index',
	name: 'index',
});

Router.route('/login');
Router.route('/register');
Router.route('/about');
Router.route('/newCard');
Router.route('/perfil');




//chamada das funções quando o documento terminar de ser inicializado
Template.index.rendered = function(){ 	
	funcBlock();
	app.logout();
}		
Template.login.rendered = function(){ 	
	funcBlock();	
}		
Template.about.rendered = function(){ 	
	funcBlock();
}		
Template.newCard.rendered = function(){ 	
	funcBlock();
}		

Template.register.rendered = function(){ 	
	app.register();
}

Template.index.helpers({
    'test' : function(){
        var currentUser = Meteor.userId();
		return Acc.find({ idUser: currentUser }, {sort: {name: -1}});
		
    }
});



// Funções


function funcBlock(){
	app.materialize();	
	app.masonry();
	app.iniCards();	
	setInterval(function(){
		app.cardFilter();		
	}, 100);
	app.loginTest();
	
}

var app = 
    (function(self, $) {
		//Inicialização dos componetes do materialize	
		self.materialize = function(){
			$(".button-collapse").sideNav();
			$('.modal').modal();
			setTimeout(function(){
				 $('.tap-target').tapTarget('open');
			}, 1000);
			$('.chips-initial').material_chip({
				placeholder: '+Filtro',
				secondaryPlaceholder: 'Filtro Tarefas',
				data: [{
				  tag: 'Matemática',
				}, {
				  tag: 'Biologia',
				}, {
				  tag: 'Quimíca',
				}, {
				  tag: 'Física',
				},	{
				  tag: 'Informática',
				}],
				autocompleteOptions: {
				  data: {
					'Informática': null,
					'Física': null,
					'Quimíca': null,
					'Matemática': null,
					'Biologia': null
				  },
				  limit: Infinity,
				  minLength: 1
				},
				
		  });
		  $('.chips-initial').find('.chip').each(function(){
			  $(this).attr('id', $(this).text());
		  })
		   $('.parallax').parallax();
		    $('ul.tabs').tabs();
			
		}
		
		
		
		//inicializando a LIB masonry...
		
		self.masonry = function(){
			var $grid = $('.grid').masonry({
			  itemSelector: '.grid-item'
			});
			$grid.masonry();	
			
			
		}
		
		//sistema de filtros
		
		self.iniCards = function(){
			console.log('teste');
			$('#cardGrid').find('.grid-item').each(function(){
				$(this).css('display', 'none');
			});			
		}
		
		self.cardFilter = function(){			
			var $grid = $('.grid').masonry({
			  itemSelector: '.grid-item'
			});		
			$('#cardGrid').find('.grid-item').each(function(){
				$(this).css('display', 'none');
			});	
			$('.chips-initial').find('.chip').each(function(){
				$('#cardGrid').find('div[id="' + $(this).text() + '"]').each(function(){
					$(this).css('display', 'block');
				});
			});
			$grid.masonry();
		}
		
		self.register = function(){
			$('#registerSubmit').click(function(){
				var nome = $('#registerNome').val(); 
				var email = $('#registerEmail').val(); 
				var password = $('#registerPass').val(); 
				Accounts.createUser({					
					email: email,
					password: password
				});
				
				var currentUser = Meteor.userId();
				
				Acc.insert({
					idUser : currentUser,
					name: nome					
				});
				Router.go('index');			
			});
		}
		
		self.logout = function(){			
			$('#logoutBtn').click(function(){				
				Meteor.logout();
				document.location.reload(true);
			});
		}
		
		self.loginTest = function(){
			$('#loginSubmit').click(function(){				
				var password = $('#loginPass').val(); 
				var email = $('#loginEmail').val();		
				Meteor.loginWithPassword(email, password, function (err) {
					if (!err) {
						Router.go('index');
					} else{
						 Materialize.toast(err.reason, 2000);
					}
				});
			});			
			
		}
		
		
		
		
		
	return self;
} (app||{}, jQuery));







