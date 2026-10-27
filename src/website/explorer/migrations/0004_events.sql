-- THE ARBITRATION SET'S LIQUIDATIONS AND SLASHES (kanban #723, Daniel 2026-10-27: "Sind die Transaktionen alle im Explorer zu sehen als
-- liquidation event?" - "Ja soll es"): each a row of its own kind beside the orders, named by the federation liquidated or the slash proof.
-- An event names many transactions, bitcoin and federation (the escrow, every payout, the remainder, path B): all of them here, space
-- separated, so a search by any one finds the event.
ALTER TABLE txs ADD COLUMN txids TEXT;
