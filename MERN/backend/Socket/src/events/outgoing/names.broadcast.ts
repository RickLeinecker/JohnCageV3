import { Concert, waitingPerformer, Performer, CustomHeader } from "../../socket.types";
import { broadcastMessage } from "../../utilities/socket.binary";

const broadcastNames = function (currentConcert: Concert): void {
    let names: string = "";

    for (let passcode in currentConcert.attendance) {
        names += '`' + currentConcert.attendance[passcode];
    }

    let utf8Encode = new TextEncoder();
    broadcastMessage(currentConcert, utf8Encode.encode("participants:" + names), true, true, true, true);
}

// // Probably should make fucntions just for getting names for each category, since I use that in multiple places.
// const broadcastNames = function (currentConcert: Concert): void {
//     let names: string = "";

//     // Performer names
//     let performers: Performer[] = currentConcert.performers;
//     for (let i = 0; i < performers.length; ++i) {
//         let nickname: string | undefined = performers.at(i)?.nickname;
//         if (nickname) {
//             names = names + '`' + nickname;
//         }
//     }

//     // Waitlist names
//     let waitingPerformers: waitingPerformer[] = currentConcert.waitingPerformers;
//     for (let i = 0; i < waitingPerformers.length; ++i) {
//         let nickname: string | undefined = waitingPerformers.at(i)?.nickname;
//         if (nickname) {
//             names = names + '`' + nickname;
//         }
//     }

//     // Maestro name
//     let maestro: Performer | undefined = currentConcert.maestro;
//     if (maestro) {
//         let nickname = maestro.nickname;
//         if (nickname) {
//             names = names + '`' + nickname;
//         }
//     }

//     let utf8Encode = new TextEncoder();
//     broadcastMessage(currentConcert, utf8Encode.encode("participants:" + names), true, true, true, true);
// }

export { broadcastNames };