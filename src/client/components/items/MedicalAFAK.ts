import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { BaseItem, BaseItemAttributes, BaseItemInstance } from "./BaseItem";

export interface MedicalAFAKInstance extends BaseItemInstance {}

export interface MedicalAFAKAttributes extends BaseItemAttributes {}

@Component({
	tag: "medicalAFAK",
})
export class MedicalAFAK<A extends MedicalAFAKAttributes, I extends MedicalAFAKInstance>
	extends BaseItem<A, I>
	implements OnStart
{
	onStart() {
		super.onStart();
	}
}
