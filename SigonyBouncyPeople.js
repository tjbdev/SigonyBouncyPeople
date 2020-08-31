/*:
 * @plugindesc Make them characters BOUNCE boi.
 * @author Sigony - (T.J.B.)
 * @version 1.1
 * 
 * @param leaderBounces
 * @default true
 * @type boolean
 * 
 * @param followersBounce
 * @default true
 * @type boolean
 * 
 * @param eventsBounce
 * @default true
 * @type boolean
 * 
 * @param eventBlackList
 * @text event blacklist, global changes won't apply to them.
 * @type number[]
 * @default []
 * 
 * LICENSE
 * Credit me in your derivative works.
 * Free for personal, non-commercial and commercial use.
 * Distribute by linking to the original post at rpgmakerweb.com
 * You can edit and redistribute, as long as you credit me and link to the original.
 * 
 * CHANGELOG
 * 1.1 - Fixed issue where events stop bouncing when their page changes.
*/

(function(){
    var parameters = PluginManager.parameters('SigonyBouncyPeople');

    function SigonyBouncyActors(){
        return new Error("this is a static class");
    }

    SigonyBouncyActors._blackListedEvents = JSON.parse(parameters['eventBlackList']);

    SigonyBouncyActors.applyLeaderBounces = function(test){
        if(test){
            $gamePlayer.setStepAnime(true);
        }else{
            $gamePlayer.setStepAnime(false);
        }
    }

    SigonyBouncyActors.applyFollowersBounce = function(test){
        if(test){
            $gamePlayer.followers().forEach(f=>f.setStepAnime(true));
        }else{
            $gamePlayer.followers().forEach(f=>f.setStepAnime(false));
        }
    }
    
    SigonyBouncyActors.applyEventsBounce = function(test){
        const events = $gameMap.events().filter(e=>!this._blackListedEvents.includes(String(e.eventId())));
        if(test){
            events.forEach(e=>e.setStepAnime(true));
        }else{
            events.forEach(e=>e.setStepAnime(false))
        }
    }

    SigonyBouncyActors.stopBounceEventCommand = function(args){
        const eventId = eval(args.shift());
        const event = $gameMap.event(eventId);
        event.setStepAnime(false);
    }

    SigonyBouncyActors.bounceEventCommand = function(args){
        const eventId = eval(args.shift());
        const event = $gameMap.event(eventId);
        event.setStepAnime(true);
    }
    

    SigonyBouncyActors.applyBounceOnEventPageChange = function(gameEvent){
        const isBlacklisted = this._blackListedEvents.includes(String(gameEvent.eventId()));
        if(isBlacklisted){return}
        else{
            gameEvent.setStepAnime(true);
        }
    }

    const Sigony_BouncyActors_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function(){
        Sigony_BouncyActors_Game_Event_setupPageSettings.call(this)
        SigonyBouncyActors.applyBounceOnEventPageChange(this);
    }

    //apply bounce when loaded
    const Sigony_BouncyActors_Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function(){
        Sigony_BouncyActors_Scene_Map_onMapLoaded.call(this);

        SigonyBouncyActors.applyLeaderBounces(parameters['leaderBounces']=='true');
        SigonyBouncyActors.applyFollowersBounce(parameters['followersBounce']=='true');
        SigonyBouncyActors.applyEventsBounce(parameters['eventsBounce']=='true');
    }



    const Sigony_BouncyActors_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		switch(command.toUpperCase()) {
            case 'STOPBOUNCEEVENT':
                SigonyBouncyActors.stopBounceEventCommand(args);
                break;
            
            case 'BOUNCEEVENT':
                SigonyBouncyActors.bounceEventCommand(args);
                break;

            case 'STOPBOUNCEEVENTS':
                SigonyBouncyActors.applyEventsBounce(false);
                break;

            case 'STOPBOUNCELEADER':
                SigonyBouncyActors.applyLeaderBounces(false);
                break;

            case 'STOPBOUNCEFOLLOWERS':
                SigonyBouncyActors.applyFollowersBounce(false);
                break;
            
            case 'BOUNCEEVENTS':
                SigonyBouncyActors.applyEventsBounce(true);
                break;

            case 'BOUNCELEADER':
                SigonyBouncyActors.applyLeaderBounces(true);
                break;

            case 'BOUNCEFOLLOWERS':
                SigonyBouncyActors.applyFollowersBounce(true);
                break;

            case 'BOUNCE':
                SigonyBouncyActors.applyLeaderBounces(true);
                SigonyBouncyActors.applyFollowersBounce(true);
                SigonyBouncyActors.applyEventsBounce(true);
                break;

            case 'STOPBOUNCE':
                SigonyBouncyActors.applyLeaderBounces(false);
                SigonyBouncyActors.applyFollowersBounce(false);
                SigonyBouncyActors.applyEventsBounce(false);
                break;

			default:
				Sigony_BouncyActors_Game_Interpreter_pluginCommand.call(this, command, args);
		}
    };

})();
