"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/icons/Icon";
import { dashboardHome } from "@/data/content";
import { Modal } from "./Modal";

interface Action {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  badges?: string[];
  modalTitle: string;
  modalBody: string;
}

const actions: Action[] = [
  {
    id: "deposita",
    icon: "wallet",
    title: dashboardHome.deposit,
    description: dashboardHome.depositDescription,
    modalTitle: dashboardHome.depositModalTitle,
    modalBody: dashboardHome.depositModalBody,
  },
  {
    id: "scambia",
    icon: "settle",
    title: dashboardHome.exchange,
    description: dashboardHome.exchangeDescription,
    badges: dashboardHome.exchangeBadges,
    modalTitle: dashboardHome.exchangeModalTitle,
    modalBody: dashboardHome.exchangeModalBody,
  },
  {
    id: "chiave",
    icon: "lock",
    title: dashboardHome.exportKey,
    description: dashboardHome.exportKeyDescription,
    modalTitle: dashboardHome.exportKeyModalTitle,
    modalBody: dashboardHome.exportKeyModalBody,
  },
];

/**
 * Scorciatoie non ancora collegate: ognuna apre una modale che lo dichiara,
 * invece di far credere che l'operazione sia avvenuta.
 */
export function QuickActions() {
  const [open, setOpen] = useState<Action | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => setOpen(action)}
            className="panel group flex items-center gap-4 p-5 text-left transition-colors duration-200 hover:border-line-strong hover:bg-panel-raised"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-card)] bg-mint/10 text-mint">
              <Icon name={action.icon} size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-wide font-semibold text-paper">{action.title}</span>
                {action.badges?.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-line bg-panel-raised px-2 py-0.5 text-[0.6875rem] text-mist"
                  >
                    {badge}
                  </span>
                ))}
              </span>
              <span className="mt-0.5 block text-sm text-mist">{action.description}</span>
            </span>
            <Icon
              name="chevron"
              size={16}
              className="shrink-0 text-mist transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        ))}
      </div>

      <Modal open={open !== null} onClose={() => setOpen(null)} title={open?.modalTitle ?? ""}>
        <p>{open?.modalBody}</p>
      </Modal>
    </>
  );
}
