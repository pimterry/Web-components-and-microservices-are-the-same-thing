module.exports = function () {
    return function (deck) {
        var notesWindow;
        var currentNotesNode;

        var notesKey = 0x53; // 83: the 's' key
        var notesSelector = "aside";

        deck.on("activate", function (e) {
            currentNotesNode = e.slide.querySelector(notesSelector);
            updateNotesWindow();
        });

        document.addEventListener("keydown", function (e) {
            if (e.keyCode === notesKey) {
                if (!notesWindow || notesWindow.closed) {
                    notesWindow = openWindow();
                    updateNotesWindow();
                } else {
                    notesWindow.close();
                    notesWindow = null;
                }
            }
        });

        function buildNotesPage(noteContent) {
            return "<div style='font-size: 40px; font-weight: bold'>" + 
                    noteContent +
                   "</div>"
        }

        function openWindow() {
            var newWindow = window.open("", "bespoke-notes");

            newWindow.addEventListener("message", function (e) {
                var body = newWindow.document.querySelector("body");
                while (body.hasChildNodes()) {
                    body.removeChild(body.lastChild);
                }

                if (e.data) {
                    body.innerHTML = buildNotesPage(e.data);
                }
            });

            return newWindow;
        }

        function updateNotesWindow() {
            if (notesWindow) {
                notesWindow.postMessage(currentNotesNode ? currentNotesNode.innerHTML : null, "*");
            }
        }
    }
}