RegisterView = require 'views/register'
AuthView    = require 'views/auth'

RegistrationModel = require 'states/registration'
AuthModel        = require 'states/auth'


module.exports = class Router extends Backbone.Router

    routes:
        'login(?next=*path)':    'login'
        'password/reset/:key':   'resetPassword'
        'register(?step=:step)': 'register'


    initialize: (options) ->
        @app = options.app


    auth: (options) ->
        auth = new AuthModel()
        @app.layout.showChildView 'content', new AuthView _.extend options,
            model: auth


    login: (path) ->
        @auth
            next:    path
            backend: '/login'
            type:    'login'


    resetPassword: (key) ->
        @auth
            next:    '/login'
            backend: window.location.pathname
            type:    'reset'


    register: (step) ->
        return @navigate 'register?step=preset', trigger: true unless step?

        currentView = @app.layout.getChildView 'content'

        unless currentView? and currentView instanceof RegisterView
            registration = new RegistrationModel()
            registration.get('step').onValue (step) =>
                @navigate "register?step=#{step}"

            currentView  = new RegisterView model: registration
            @app.layout.showChildView 'content', currentView

        currentView.model.setStep step
