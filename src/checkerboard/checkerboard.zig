const std = @import("std");

const CHECKERBOARD_SIZE: i32 = 20;
const BUFFER_SIZE: i32 = CHECKERBOARD_SIZE * CHECKERBOARD_SIZE * 4;

var buffer = std.mem.zeroes([BUFFER_SIZE]u8);

export fn GetGraphicsBufferPtr() *[BUFFER_SIZE]u8 {
	return &buffer;
}

export fn GetGraphicsBufferSize() i32 {
	return BUFFER_SIZE;
}

export fn GenerateCheckerboard(
	dark_red: u8,
	dark_green: u8,
	dark_blue: u8,
	light_red: u8,
	light_green: u8,
	light_blue: u8,
) void {
	var y: i32 = 0;
	while (y < CHECKERBOARD_SIZE) : (y += 1) {
		var x: i32 = 0;
		while (x < CHECKERBOARD_SIZE) : (x += 1) {
			var is_dark = @mod(y, 2) != 0;
			if (@mod(x, 2) == 0) {
				is_dark = !is_dark;
			}

			const base = (y * CHECKERBOARD_SIZE) + x;
			const i = base * 4;

			buffer[@intCast(i + 0)] = if (is_dark) dark_red else light_red;
			buffer[@intCast(i + 1)] = if (is_dark) dark_green else light_green;
			buffer[@intCast(i + 2)] = if (is_dark) dark_blue else light_blue;
			buffer[@intCast(i + 3)] = 255;
		}
	}
}
