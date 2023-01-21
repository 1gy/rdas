import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	List,
	ListItem,
	ListItemText,
} from "@suid/material";
import { Features, loadSettings, saveSettings } from "../../libs/store";
import { Component, createSignal } from "solid-js";

const SettingItem: Component<{
	label: string;
	checked: boolean;
	onChanged: (value: boolean) => void;
}> = (props) => {
	return (
		<ListItem disablePadding>
			<ListItemText
				primary={
					<FormControlLabel
						label={props.label}
						control={
							<Checkbox
								checked={props.checked}
								onChange={(ev) => {
									props.onChanged(!ev.target.checked);
								}}
							/>
						}
					/>
				}
			/>
		</ListItem>
	);
};

export const SettingsDialog: Component<{
	open: boolean;
	setOpen: (value: boolean) => void;
}> = (props) => {
	const [settings, setSettings] = createSignal(loadSettings());
	const handleCheck = (feature: keyof Features) => (checked: boolean) => {
		setSettings((prev) => ({
			...prev,
			features: { ...prev.features, [feature]: checked },
		}));
	};

	const save = () => {
		saveSettings(settings());
		document.location.reload();
	};

	const handleClose = () => {
		props.setOpen(false);
	};

	return (
		<Dialog
			open={props.open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{"Settings"}</DialogTitle>
			<DialogContent>
				<List>
					<SettingItem
						label="addFooterMenu"
						checked={settings().features?.addFooterMenu ? true : false}
						onChanged={handleCheck("addFooterMenu")}
					/>
					<SettingItem
						label="hideFooterBottom"
						checked={settings().features?.hideFooterBottom ? true : false}
						onChanged={handleCheck("hideFooterBottom")}
					/>
					<SettingItem
						label="hideGoods"
						checked={settings().features?.hideGoods ? true : false}
						onChanged={handleCheck("hideGoods")}
					/>
					<SettingItem
						label="hideSong"
						checked={settings().features?.hideSong ? true : false}
						onChanged={handleCheck("hideSong")}
					/>
					<SettingItem
						label="showCompleted"
						checked={settings().features?.showCompleted ? true : false}
						onChanged={handleCheck("showCompleted")}
					/>
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={save}>Save</Button>
			</DialogActions>
		</Dialog>
	);
};
