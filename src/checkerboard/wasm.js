'use strict'

function getDarkValue() {
	return Math.floor(Math.random() * 100);
}

function getLightValue() {
	return Math.floor(Math.random() * 127) + 127;
}

window.document.body.onload = function() {
	WebAssembly
		.instantiateStreaming(fetch('zig-out/lib/main.wasm'), {})
		.then(res => {
			console.log("WASM loaded");

			const { exports } = res.instance;
			const wasm_byte_memory_array = new Uint8Array(exports.memory.buffer);
			const buffer_ptr = exports.GetGraphicsBufferPtr();
			const buffer_size = exports.GetGraphicsBufferSize();

			const canvas = document.querySelector("canvas");
			const ctx = canvas.getContext("2d");
			const canvas_image = ctx.createImageData(canvas.width, canvas.height);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			function drawCheckerboard() {
				exports.GenerateCheckerboard(
					getDarkValue(), getDarkValue(), getDarkValue(),
					getLightValue(), getLightValue(), getLightValue(),
				);

				const image_data_array = wasm_byte_memory_array.slice(buffer_ptr, buffer_ptr + buffer_size);
				canvas_image.data.set(image_data_array);

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.putImageData(canvas_image, 0, 0);
			}

			drawCheckerboard();
			setInterval(() => {
				drawCheckerboard();
			}, 1000)
		});
}
