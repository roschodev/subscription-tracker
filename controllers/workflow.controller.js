import dayjs from "dayjs";
import {createRequire } from 'module';
import express from "express";
import Subscription from "../models/subscription.model.js";
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

const REMINDERS = [7,5,2,1]

export const sendReminders = serve(async (context) => {
    const subscriptionID = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionID);

    if (!subscription || subscription.status !== 'active') return;
    console.log(`Reminder Date has executed.`)
    const renewalDate = dayjs(subscription.renewalDate);
    if(renewalDate.isBefore(dayjs())){
        console.log('Renewal Date has passed. Workflow Exiting.')
        return;
    }

    for ( const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        if (reminderDate.isAfter(dayjs())){
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }
        await triggerReminder(context, `Reminder ${daysBefore} days after`);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    });
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleep until reminder ${label} at ${date}`);
    await context.sleepUntil(label, date.toDate());

}

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Trigger reminder ${label}`);
    })
}
