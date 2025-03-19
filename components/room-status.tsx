"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BedDouble, Check, Brush, Wrench, LogIn, LogOut, Users, Building, User } from "lucide-react"

interface RoomStatusProps {
  totalRooms: number
  occupied: number
  available: number
  cleaning: number
  maintenance: number
  checkin: number
  checkout: number
  people: number
  outOfRental: number
  owner: number
}

export function RoomStatus({
  totalRooms,
  occupied,
  available,
  cleaning,
  maintenance,
  checkin,
  checkout,
  people,
  outOfRental,
  owner,
}: RoomStatusProps) {
  const { t } = useLanguage()

  const statusItems = [
    {
      label: t("occupied"),
      value: occupied,
      percentage: Math.round((occupied / totalRooms) * 100),
      icon: BedDouble,
      color: "bg-red-100 text-red-600",
    },
    {
      label: t("available"),
      value: available,
      percentage: Math.round((available / totalRooms) * 100),
      icon: Check,
      color: "bg-green-100 text-green-600",
    },
    {
      label: t("cleaning"),
      value: cleaning,
      percentage: Math.round((cleaning / totalRooms) * 100),
      icon: Brush,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: t("maintenance"),
      value: maintenance,
      percentage: Math.round((maintenance / totalRooms) * 100),
      icon: Wrench,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: t("checkin"),
      value: checkin,
      percentage: Math.round((checkin / totalRooms) * 100),
      icon: LogIn,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: t("checkout"),
      value: checkout,
      percentage: Math.round((checkout / totalRooms) * 100),
      icon: LogOut,
      color: "bg-orange-100 text-orange-600",
    },
    {
      label: t("people"),
      value: people,
      percentage: Math.round((people / totalRooms) * 100),
      icon: Users,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: t("out_of_rental"),
      value: outOfRental,
      percentage: Math.round((outOfRental / totalRooms) * 100),
      icon: Building,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      label: t("owner"),
      value: owner,
      percentage: Math.round((owner / totalRooms) * 100),
      icon: User,
      color: "bg-pink-100 text-pink-600",
    },
  ]

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{t("room_status")}</CardTitle>
        <div className="text-sm text-muted-foreground">
          {totalRooms} {t("units_in_rental")}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {statusItems.map((item) => (
            <div
              key={item.label}
              className={cn("flex flex-col items-center justify-center rounded-lg p-4", item.color)}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center">
                  <item.icon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-xs">{item.percentage}%</span>
              </div>
              <div className="text-3xl font-bold">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

