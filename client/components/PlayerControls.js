import { ActionIcon, Center, Grid, Group, Slider, Text } from "@mantine/core";
import {
	IconAspectRatio,
	IconChevronsLeft,
	IconChevronsRight,
	IconNotes,
	IconPlayerPause,
	IconPlayerPlay,
	IconVolume,
	IconVolumeOff,
} from "@tabler/icons";
import { forwardRef } from "react";

const PlayerControls = forwardRef(
	(
		{
			clicked,
			onPlayPause,
			playing,
			muted,
			volume,
			played,
			onRewind,
			onForward,
			onMute,
			onVolumeChange,
			onVolumeSeekDown,
			onToggleFullscreen,
			onSeek,
			onSeekMouseUp,
			onSeekMouseDown,
		},
		ref,
	) => {
		return (
			<div className='controls-wrapper' ref={ref}>
				<Text p={16} size='xl' sx={{ color: "#fff" }}>
					{clicked?.title}
				</Text>
				<Center>
					<Grid justify='center' align='center'>
						<Grid.Col span={4}>
							<ActionIcon onClick={onRewind}>
								<IconChevronsLeft size={50} />
							</ActionIcon>
						</Grid.Col>
						<Grid.Col span={4}>
							<ActionIcon onClick={onPlayPause}>
								{playing ? (
									<IconPlayerPause size={50} />
								) : (
									<IconPlayerPlay size={50} />
								)}
							</ActionIcon>
						</Grid.Col>
						<Grid.Col span={4}>
							<ActionIcon onClick={onForward}>
								<IconChevronsRight size={50} />
							</ActionIcon>
						</Grid.Col>
					</Grid>
				</Center>
				<Grid justify='center' align='center' p={16}>
					<Grid.Col span={12}>
						<Slider
							label={Math.round(played * 10)}
							value={played * 100}
							onChange={onSeek}
							onChangeEnd={onSeekMouseUp}
							onMouseDown={onSeekMouseDown}
							labelTransition='skew-down'
							labelTransitionDuration={150}
							labelTransitionTimingFunction='ease'
						/>
					</Grid.Col>
					<Grid.Col>
						<Group position='apart'>
							<Group>
								<ActionIcon onClick={onPlayPause}>
									{playing ? (
										<IconPlayerPause size={50} />
									) : (
										<IconPlayerPlay size={50} />
									)}
								</ActionIcon>
								<ActionIcon onClick={onMute}>
									{muted ? (
										<IconVolumeOff size={50} />
									) : (
										<IconVolume size={50} />
									)}
								</ActionIcon>
								<Slider
									value={Math.ceil(volume * 100)}
									onChange={onVolumeChange}
									onChangeEnd={onVolumeSeekDown}
									size='xs'
									sx={{ width: 100 }}
								/>

								<ActionIcon>
									<IconNotes size={50} />
								</ActionIcon>
							</Group>
							<Group position='right'>
								<ActionIcon onClick={onToggleFullscreen}>
									<IconAspectRatio size={50} />
								</ActionIcon>
							</Group>
						</Group>
					</Grid.Col>
				</Grid>
			</div>
		);
	},
);

export default PlayerControls;
