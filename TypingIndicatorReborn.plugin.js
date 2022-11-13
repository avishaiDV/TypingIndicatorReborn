/**
 * @name TypingIndicatorReborn
 * @displayName TypingIndicatorReborn
 * @website https://twitter.com/avishaidv/
 * @description This plugin is the rewritten version of TypingIndicator.
 * @author avishai
 * @authorId 479752425268314112
 * @source https://github.com/avishaiDV/TypingIndicatorReborn
 */

 module.exports = (() => {
    const config = {
        info:{
            name: "TypingIndicatorReborn",
            authors: [{name: "avishai", github_username: "avishaiDV", twitter_username: "avishaidv", discord_id: "479752425268314112"}],
            description: "Light in channel list when someone is typing there.",
            version: "0.0.1",
        },
        changelog:[
            {
                "title": "Initial Version of TypingIndicatorReborn",
                "type": "fixed",
                "items": ["Now using the Dispatcher to get typing users info"]
            }
        ]
    };
    
    return !global.ZeresPluginLibrary ? class {
        constructor(){this._config = config;}
        getName(){return config.info.name;}
        getAuthor(){return config.info.authors.map(a => a.name).join(", ");}
        getDescription(){return config.info.description + " **Install [ZeresPluginLibrary](https://betterdiscord.app/Download?id=9) and restart discord to use this plugin!**";}
        getVersion(){return config.info.version;}

        
        load(){}

        start(){}
        stop(){}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const { WebpackModules } = Api;
            const Dispatcher = WebpackModules.getByProps(("dispatch", "isDispatching"))
            let channels = []

            return class TypingIndicatorReborn extends Plugin {

               onSwitch() {
                   channels.forEach((c) => {
                       const channel = document.querySelectorAll(
                           `[data-list-item-id=channels___${c.id}]`
                       )[0]?.parentElement

                       if(!channel) return

                       channel.style.transition = 'all .5s'
                       channel.style.boxShadow = '0px 0px 20px white'

                       clearTimeout(c.timeout)

                       c.timeout = setTimeout(() => {
                           channel.style.boxShadow = ''
                           channels = channels.filter(b => b.id !== c.id)
                       }, 7000)

                   })

               }

                onStart(){
                    Dispatcher.subscribe("TYPING_START", ({channelId, type, userId}) => {
                       try {
                           const channel = document.querySelectorAll(
                               `[data-list-item-id=channels___${channelId}]`
                           )[0]?.parentElement

                           if(!channel) return
                           channel.style.transition = 'all .5s'
                           channel.style.boxShadow = '0px 0px 20px white'
   
                           const timeout = setTimeout(() => {
                               channel.style.boxShadow = ''
                               channels = channels.filter(c => c.id !== channelId)
                           }, 7000)
                           
                           const channelExist = channels.find(c => c.id === channelId)
                           if(channelExist) {
                               clearTimeout(channelExist.timeout)
                               channel.timeout = timeout
                           } else {
                               channels.push({
                                   id: channelId,
                                   timeout
                               })  
                           }
                       } catch(e) {
                           console.error(e)
                       }
                     
                    })

                }

                onStop(){
                   Dispatcher.unsubscribe("TYPING_START")
                }
                
    }
   }
   return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
})();
