import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required."],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required."],
        min: [0, "Price must be greater than 0."]
    },
    currency: {
        type: String,
        enum: ["EUR", "USD", "GBP"],
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"]
    },
    category: {
        type: String,
        enum: ["sports", "finance", "news", "entertainment", "employment", "technology"],
        required: [true, "Category is required."],
    },
    paymentMethod: {
        type: String,
        required: [true, "PaymentMethod is required."],
        trim: true

    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
    },
    startDate: {
        type: Date,
        required: [true, "StartDate is required."],
        validate: {
            validator: (value) => value < Date.now(),
            message: 'Invalid start date. It must be in the past.'
        }
    },
    renewalDate: {
        type: Date,
        required: [false, "RenewalDate is required."],
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'Invalid renewalDate. It must be in the future!'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required."],
        index: true,
    }
}, {timestamps: true} );


subscriptionSchema.pre("save", function (next) {
        if(!this.renewalDate){
            const renewalPeriods = {
                daily: 1,
                weekly: 7,
                monthly: 30,
                yearly: 365,
            };
            this.renewalDate = new Date(this.startDate);
            this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
        }
        if (this.renewalDate < new Date()) {
            this.status = "expired";
        }
        next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;

