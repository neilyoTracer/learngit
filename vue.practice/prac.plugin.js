export default { 
    install: (app, options) => { 
        app.config.globProperties.$translate = key => 
            key.split('.').reduce((o, i) => { 
                if(o) return o[i]
            }, options)

        app.provide('i18n', options)    
    }
}

const app = createApp({})
app.use(somePlugin, { 
    greetings: { 
        hello: 'Bonjour!'
    }
})