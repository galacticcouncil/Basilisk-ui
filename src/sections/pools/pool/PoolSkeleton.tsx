import { Text } from "components/Typography/Text/Text"
import { SContainer, SGridContainer } from "./Pool.styled"
import { useTranslation } from "react-i18next"
import { PoolType } from "@galacticcouncil/sdk"
import Skeleton from "react-loading-skeleton"
import { Separator } from "components/Separator/Separator"
import { Spacer } from "components/Spacer/Spacer"
import { useMedia } from "react-use"
import { theme } from "theme"
import { SActionsContainer, SButtonOpen } from "./actions/PoolActions.styled"
import { Button } from "components/Button/Button"
import { ReactComponent as ChevronDown } from "assets/icons/ChevronDown.svg"
import { ReactComponent as MinusIcon } from "assets/icons/MinusIcon.svg"
import { ReactComponent as PlusIcon } from "assets/icons/PlusIcon.svg"
import { ReactComponent as WindMillIcon } from "assets/icons/WindMillIcon.svg"
import { Icon } from "components/Icon/Icon"

const FARM_AMOUNT = 3

export const PoolSkeleton = ({
  length,
  index,
}: {
  length: number
  index: number
}) => {
  const { t } = useTranslation()
  const isDesktop = useMedia(theme.viewport.gte.sm)

  return (
    <SContainer css={{ opacity: length <= index + 1 ? 0.8 : 1 }}>
      <SGridContainer>
        <div sx={{ flex: "column" }} css={{ gridArea: "details" }}>
          <div sx={{ flex: "row", justify: "space-between", align: "start" }}>
            <div>
              <Text fs={14} lh={26} fw={400} color="neutralGray400">
                {t("pools.pool.title", { poolType: PoolType.XYK })}
              </Text>
              <div sx={{ flex: "row", align: "center", gap: 4 }}>
                <Skeleton circle width={32} height={32} />
                <div sx={{ flex: "column" }}>
                  <Skeleton width={39} height={15} />
                  <Skeleton width={72} height={10} />
                </div>
              </div>
            </div>
            <div sx={{ flex: "row", align: "center" }}>
              <div
                sx={{
                  flex: "column",
                  justify: "center",
                  width: ["auto", "auto", 120],
                }}
              >
                <Text fs={14} fw={400} color="neutralGray400" lh={26}>
                  {t("pools.pool.poolDetails.fee")}
                </Text>
                <Skeleton width={118} height={21} />
              </div>
            </div>
          </div>
          <Separator sx={{ mt: [18, 18, 34] }} />
        </div>

        <div css={{ gridArea: "incentives" }}>
          <Text fs={14} lh={26} fw={400} color="neutralGray400">
            {t("pools.pool.incentives.title")}
          </Text>
          <Spacer size={[0, 0, 18]} />
          <div>
            {[...Array(isDesktop ? FARM_AMOUNT : 1)].map((_, farmIndex) => (
              <div
                key={`${index}_${farmIndex}`}
                sx={{
                  flex: "row",
                  justify: "space-between",
                  align: "center",
                  py: 12,
                }}
                css={{
                  " &:not(:last-child)": {
                    borderBottom: `1px solid rgba(${theme.rgbColors.white}, 0.06)`,
                  },
                }}
              >
                <div sx={{ flex: "row", gap: 8, align: "center" }}>
                  <Skeleton circle width={32} height={32} />
                  <Skeleton width={78} height={15} />
                </div>
                <div>
                  <Skeleton
                    width={isDesktop ? 78 : 118}
                    height={isDesktop ? 15 : 21}
                  />
                </div>
              </div>
            ))}
          </div>
          <Separator sx={{ mt: 18, display: ["block", "block", "none"] }} />
        </div>

        <div
          sx={{ flex: "row", justify: "space-between", align: "end", mb: 16 }}
          css={{ gridArea: "values" }}
        >
          <div sx={{ flex: "column", gap: 10 }}>
            <Text fs={14} color="neutralGray400" lh={26}>
              {t("pools.pool.poolDetails.total")}
            </Text>
            <div sx={{ flex: "row", align: "center", gap: 8, mb: 8 }}>
              <Skeleton width={118} height={21} />
            </div>
          </div>
          <div sx={{ flex: "column", gap: 10 }}>
            <div sx={{ flex: "row", align: "center", gap: 6 }}>
              <Text
                fs={14}
                color="neutralGray400"
                lh={26}
                fw={400}
                css={{ display: "inline" }}
              >
                {t("pools.pool.poolDetails.24hours")}
              </Text>
            </div>
            <Skeleton width={118} height={21} />
          </div>
        </div>

        {isDesktop && (
          <SActionsContainer css={{ gridArea: "actions" }}>
            <div
              sx={{
                width: ["auto", 214],
                flex: "column",
                gap: 10,
                mt: [19, 0],
              }}
            >
              <Button fullWidth size="small" disabled>
                <div sx={{ flex: "row", align: "center", justify: "center" }}>
                  <Icon icon={<PlusIcon />} sx={{ mr: 8 }} />
                  {t("pools.pool.actions.addLiquidity")}
                </div>
              </Button>

              <Button fullWidth size="small" disabled>
                <div sx={{ flex: "row", align: "center", justify: "center" }}>
                  <Icon icon={<MinusIcon />} sx={{ mr: 8 }} />
                  {t("pools.pool.actions.removeLiquidity")}
                </div>
              </Button>

              <Button fullWidth size="small" disabled>
                <div sx={{ flex: "row", align: "center", justify: "center" }}>
                  <Icon icon={<WindMillIcon />} sx={{ mr: 8 }} />
                  {t("pools.pool.actions.joinFarm")}
                </div>
              </Button>
            </div>
            <SButtonOpen disabled isActive={false}>
              <ChevronDown />
            </SButtonOpen>
          </SActionsContainer>
        )}
      </SGridContainer>
    </SContainer>
  )
}
