import {Time} from "../../models/time.model";
import {createEntityAdapter, EntityState} from '@ngrx/entity';

export const adapter = createEntityAdapter<Time>();

export interface TimeState extends EntityState<Time> {
    editing: boolean;
    saving: boolean;
    loaded: boolean;
}
