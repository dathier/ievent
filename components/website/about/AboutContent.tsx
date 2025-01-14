import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function AboutContent() {
  const t = useTranslations("About");

  return (
    <div className="space-y-12">
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("missionTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{t("missionContent")}</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("teamTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed mb-6">{t("teamContent")}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((member) => (
                <div key={member} className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <Image
                      src={`/aboutus/team-member-${member}.jpeg`}
                      alt={`Team Member ${member}`}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {t(`teamMember${member}Name`)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t(`teamMember${member}Position`)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("contactTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed mb-6">
              {t("contactContent")}
            </p>
            <Button size="lg">{t("contactButton")}</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
