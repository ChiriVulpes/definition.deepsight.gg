import { VendorHashes } from "@deepsight.gg/Enums";
import fs from "fs-extra";
import { Task } from "task";
import DestinyVendors from "./utility/endpoint/DestinyVendors";

export default Task("DeepsightVendorDefinition", async () => {
	const vendors = await DestinyVendors.get();

	const DeepsightVendorDefinition = {
		[VendorHashes.IronBanner]: vendors[VendorHashes.IronBanner],
		[VendorHashes.NeomunaFaction]: vendors[VendorHashes.NeomunaFaction],
		[VendorHashes.ThroneworldFaction]: vendors[VendorHashes.ThroneworldFaction],
		[VendorHashes["30thAnniversaryStarhorse"]]: vendors[VendorHashes["30thAnniversaryStarhorse"]],
		[VendorHashes.TowerNine]: vendors[VendorHashes.TowerNine],
		[VendorHashes["30thAnniversaryXur"]]: vendors[VendorHashes["30thAnniversaryXur"]],
		[VendorHashes.TowerAda]: vendors[VendorHashes.TowerAda],
		[VendorHashes.Gunsmith]: vendors[VendorHashes.Gunsmith],
		[VendorHashes.TessEveris]: vendors[VendorHashes.TessEveris],
		[VendorHashes.TitanVanguard]: vendors[VendorHashes.TitanVanguard],
		[VendorHashes.Gambit]: vendors[VendorHashes.Gambit],
		[VendorHashes.TowerSaint14]: vendors[VendorHashes.TowerSaint14],
		[VendorHashes.Crucible]: vendors[VendorHashes.Crucible],
		[VendorHashes.PlanetEdz]: vendors[VendorHashes.PlanetEdz],
		[VendorHashes.PlanetNessus]: vendors[VendorHashes.PlanetNessus],
		[VendorHashes.ErisMorn]: vendors[VendorHashes.ErisMorn],
		[VendorHashes.RuneTable]: vendors[VendorHashes.RuneTable],
		[VendorHashes.CosmodromeFaction]: vendors[VendorHashes.CosmodromeFaction],
		[VendorHashes.DreamingCityPetraVenj]: vendors[VendorHashes.DreamingCityPetraVenj],
		[VendorHashes.EuropaFaction]: vendors[VendorHashes.EuropaFaction],
		[VendorHashes.HelmWarTable]: vendors[VendorHashes.HelmWarTable],
		[VendorHashes.EvaLevanteVendor]: vendors[VendorHashes.EvaLevanteVendor],
	};

	////////////////////////////////////
	// Write!

	await fs.mkdirp('docs/definitions');
	await fs.writeJson("docs/definitions/DeepsightVendorDefinition.json", DeepsightVendorDefinition, { spaces: "\t" });
});
