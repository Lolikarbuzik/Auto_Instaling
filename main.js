// ==UserScript==
// @name         AutoStaling
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://instaling.pl/ling2/html_app/app.php?child_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var actions = "https://instaling.pl/ling2/server/actions"
    var child_id = window.currentChildId
    var version = "C65E24B29F60B1231EC23D979C9707D2"
    var ajax = $.ajax

    function new_updateParams(id, answer, show_grade, version) {
        $.ajax({
            url: '../server/actions/save_answer.php',
            type: "POST",
            dataType: 'json',
            data: {
                child_id: currentChildId,
                word_id: id,
                answer: answer,
                version: version
            }
        }).done(function(data) {
            showAnswerPage(id, answer, data.usage_example, data.translations, data.grade, data.word,
                data.answershow, data.has_audio, show_grade);
        }).error(function() {
            alert('Błąd połączenia');
        });
    }

    function new_getNextWord() {
				$.ajax({
					url: '../server/actions/generate_next_word.php',
					type: "POST",
					dataType: 'json',
					data: {child_id:currentChildId, date:new Date().getTime()}
				}).done(function(data) {
                    answer(data.id).done(answer=>{
                        console.log("Poprawna odpowiedź to "+answer.word)
                        $("#answer").insertIntoTextArea(answer.word)
                    })
					if (typeof data.id == 'undefined') {
						finishPageShow(data.summary);
					} else{
						learningPageShow(data.id, data.speech_part, data.usage_example, data.translations, data.word, data.has_audio, data.audio_file_name, data.is_new_word, data.type == 'marketing');
					}
				}).error(function() {
					alert('Błąd połączenia');
				});
			}

    function get_next_word() {
        return ajax({
            url: '../server/actions/generate_next_word.php',
            type: "POST",
            dataType: 'json',
            data: {
                child_id: child_id,
                date: new Date().getTime(),
                repeat: "",
                start: "",
                end: ""
            }
        })
    }

    function answer(id, answer = false) {
        return ajax({
            url: '../server/actions/save_answer.php',
            type: "POST",
            dataType: 'json',
            data: {
                child_id: child_id,
                word_id: id,
                answer: answer,
                version: version
            }
        })
    }

    // hooking updateParams func to custom

    updateParams = new_updateParams
    getNextWord = new_getNextWord
})();
