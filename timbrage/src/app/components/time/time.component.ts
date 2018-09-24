import {Time, TimeAdapter} from "../../models/time.model";
import {Store} from '@ngxs/store';
import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UpdateTime} from "../../store/time.store";

@Component({
    selector: 'app-time',
    templateUrl: './time.component.html',
    styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {

    @Input() set time(time: Time) {
        this.adapter = new TimeAdapter(time);
    }

    public adapter: TimeAdapter;

    public hours = [];
    public minutes = [];

    public form: FormGroup;

    editing = false;

    constructor(private fb: FormBuilder, private store: Store) {
        for (let i = 0; i < 24; i++) {
            this.hours.push(i);
        }
        for (let i = 0; i < 60; i++) {
            this.minutes.push(i);
        }
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            hours: ['', Validators.required],
            minutes: ['', Validators.required]
        });
    }

    ngOnInit() {
    }

    public startEditing() {
        this.editing = true;
        this.form.setValue({hours: this.adapter.hours, minutes: this.adapter.minutes});
    }

    public onSubmit() {
        this.adapter.hours = this.form.value.hours;
        this.adapter.minutes = this.form.value.minutes;
        this.editing = false;
        this.store.dispatch(new UpdateTime(this.adapter.time));
    }

    public revert() {
        this.editing = false;
    }
}
