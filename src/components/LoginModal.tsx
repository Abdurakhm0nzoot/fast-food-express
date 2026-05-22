import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

export function LoginModal() {
  const { t } = useI18n();
  const { loginOpen, setLoginOpen, setPhone } = useApp();
  const [phone, setPhoneInput] = useState("");
  const [a1, setA1] = useState(true);
  const [a2, setA2] = useState(true);

  const formatPhone = (raw: string) => {
    let d = raw.replace(/\D/g, "");
    if (d.startsWith("998")) d = d.slice(3);
    d = d.slice(0, 9);
    let out = "+998";
    if (d.length > 0) out += " " + d.slice(0, 2);
    if (d.length > 2) out += " " + d.slice(2, 5);
    if (d.length > 5) out += " " + d.slice(5, 7);
    if (d.length > 7) out += " " + d.slice(7, 9);
    return out;
  };

  const digits = phone.replace(/\D/g, "").replace(/^998/, "");
  const valid = digits.length === 9 && a1 && a2;

  const submit = () => {
    if (!valid) return;
    setPhone(formatPhone(phone));
    setLoginOpen(false);
    setPhoneInput("");
  };

  return (
    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-display text-3xl">{t("login.title")}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">{t("login.phone")}</label>
            <input
              type="tel"
              autoFocus
              value={phone || "+998 "}
              onChange={(e) => setPhoneInput(formatPhone(e.target.value))}
              placeholder="+998 __ ___ __ __"
              className="w-full px-4 py-3 border-2 border-primary/40 focus:border-primary outline-none rounded-lg text-lg font-medium tabular-nums bg-card"
            />
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <ShieldCheck className="size-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs text-muted-foreground">
              reCAPTCHA · {t("login.welcome")}
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <Checkbox checked={a1} onCheckedChange={(c) => setA1(c === true)} className="mt-0.5" />
            <span>{t("login.agree1")}</span>
          </label>
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <Checkbox checked={a2} onCheckedChange={(c) => setA2(c === true)} className="mt-0.5" />
            <span>{t("login.agree2")}</span>
          </label>

          <Button
            onClick={submit}
            disabled={!valid}
            size="lg"
            className="w-full brand-gradient text-brand-foreground hover:opacity-90 disabled:opacity-50"
          >
            {t("login.button")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
