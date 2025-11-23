export function moneyFormat(amount,affix) {
    // Convert the amount to a number if it's not already
    amount = Number(parseInt(amount));

    // Check if the amount is a valid number
    if (isNaN(amount)) {
        return "Invalid amount";
    }

    // Use the toLocaleString() method to format the amount with commas
    return (affix==null ? "₮":" ") + amount.toLocaleString("en-US");
}
