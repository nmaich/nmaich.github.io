{
	var midi = null;
	var inputs = null;
	var outputs = null;
	var input_id = 0;
	var output_id = 0;
	var input = null;
	var output = null;
	var input_menu = null;
	var output_menu = null;

	var log = null;

	//initialize --------------------------------------------------------------------
	function initMidi() {
		if (!log)
			log = document.getElementById("log");
		navigator.requestMIDIAccess({ sysex: true }).then(success, failure);
	}

	function success(midiAccess) {
		midi = midiAccess;

		if (typeof midi.inputs === "function") {
			inputs = midi.inputs();
			outputs = midi.outputs();
		} else {
			var inputIterator = midi.inputs.values();
			inputs = [];
			for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
				inputs.push(o.value)
			}
			var outputIterator = midi.outputs.values();
			outputs = [];
			for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
				outputs.push(o.value)
			}
		}

		if (log != null) {
			log.innerText = "MIDI ready!";
			log.innerText += "\n";
			log.innerText += "input_id=";
			log.innerText += inputs.length;
			log.innerText += "\n";
			log.innerText += "output_id=";
			log.innerText += outputs.length;
			log.innerText += "\n";
		}

		if (input_menu != null) createInputDeviceOption();
		if (output_menu != null) createOutputDeviceOption();
	}

	function failure(error) {
		alert("Failed MIDI!" + msg);
	}

	// drop down menu-------------------------------------------------------------------
	function setOutputMenu(element) {
		output_menu = element;
	}

	function setInputMenu(element) {
		input_menu = element;
	}

	// create options and set default input output
	function createInputDeviceOption() {
		var i = 0;
		if (midi != null) {
			if (inputs.length > 0) {
				for (i = 0; i < inputs.length; i++)
					input_menu.options[i + 1] = new Option(inputs[i].name, i + 1);
				input_menu.value = 1;
				input_id = 0;
				input = inputs[input_id];
				input.onmidimessage = handleMIDIMessage0;
			} else {
				no_midi_interface = 1;
			}
		}
	}

	function createOutputDeviceOption() {
		var i = 0;
		if (midi != null) {
			if (outputs.length > 0) {
				for (i = 0; i < outputs.length; i++)
					output_menu.options[i + 1] = new Option(outputs[i].name, i + 1);
			}
			output_menu.value = 1;
			output_id = 0;
			output = outputs[output_id];
		}
	}

	// on change, change input output
	function inputDeviceSelect(item) {
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].onmidimessage = handleMIDIMessage0;
		}

		input_id = item.options[item.selectedIndex].value - 1;

		if (input_id != -1) {
			input = inputs[input_id];
			input.onmidimessage = handleMIDIMessage1;
		} else {
			input = null;
		}

		if (log != null) {
			log.innerText = "input_id=";
			log.innerText += input_id + 1;
			log.innerText += "\n";
		}
	}

	function outputDeviceSelect(item) {
		output_id = item.options[item.selectedIndex].value - 1;
		if (output_id != -1) {
			output = outputs[output_id];
		} else {
			output = null;
		}

		if (log != null) {
			log.innerText += "output_id=";
			log.innerText += output_id;
			log.innerText += "\n";
		}
	}

	// utility function-----------------------------------------------------------------
	function outMessage(data1, data2, data3) {
		if (output != null) output.send([data1, data2, data3], 0);
	}

	//callback for midi input ------------------------------------------------------------
	function handleMIDIMessage0(event) { }

	function handleMIDIMessage1(event) {
		var str = null;
		var i, k;

		if (event.data[0] == 0xFE) return;

		if (event.data.length > 1) {
			str = "data.length=" + event.data.length + ":" + " 0x" + event.data[0].toString(16) + ":";
			if (log != null) log.innerText += str;

			for (i = 1, k = 0; i < event.data.length; i++, k++) {
				str = " 0x" + event.data[i].toString(16) + ":";
				if (log != null) log.innerText += str;
				if (i % 8 == 0) {
					if (log != null) log.innerText += "\n";
				}
			}
		}
		str = "\n";
		if (log != null) log.innerText += str;
	}

}