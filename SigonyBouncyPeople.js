/*:
 * @plugindesc Make them characters BOUNCE boi.
 * @author Sigony - (T.J.B.)
 * @version 1.0
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
 * 
 * LICENSE
 * Credit me in your derivative works.
 * Free for personal, non-commercial and commercial use.
 * Distribute by linking to the original post at rpgmakerweb.com
 * You can edit and redistribute, as long as you credit me and link to the original.
*/

(function(){
    var parameters = PluginManager.parameters('SigonyBouncyPeople');

    function SigonyBouncyActors(){
        return new Error("this is a static class");
    }

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
        if(test){
            $gameMap.events().forEach(e=>e.setStepAnime(true));
        }else{
            $gameMap.events().forEach(e=>e.setStepAnime(false))
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
    


    const Sigony_BouncyActors_Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function(){
        Sigony_BouncyActors_Scene_Map_onMapLoaded.call(this);

        SigonyBouncyActors.applyLeaderBounces(parameters['leaderBounces']=='true');
        SigonyBouncyActors.applyFollowersBounce(parameters['followersBounce']=='true');
        SigonyBouncyActors.applyEventsBounce(parameters['eventsBounce']=='true');
    }

    const Sigony_BouncyActors_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
        console.log(command);
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