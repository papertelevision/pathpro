/**
 * Internal dependencies
 */
import Page from '@app/components/page/page';
import Loader from '@app/components/loader/loader';
import Subheader from '@app/components/subheader/subheader';
import FormEditHeader from '@app/domain/header/components/form-edit-header';
import useHeaderShowQuery from '@app/data/header/use-header-show-query';
import TooltipHeaderSettings from '@app/components/tooltip/tooltip-header-settings';
import { usePermissionsContextApi } from '@app/lib/permissions-context-api';

const projectSlug = document.getElementById('root').getAttribute('projectSlug');

const HeaderSettingsPage = () => {
    const { data, isLoading } = useHeaderShowQuery(projectSlug);

    const { canEditCustomHeader } = usePermissionsContextApi();

    if (isLoading) {
        return <Loader white fixed />;
    }

    return (
        <>
            <Subheader>
                <Subheader.Left>
                    <strong>Settings & Design</strong>
                </Subheader.Left>
            </Subheader>
            <Page color="gray">
                {projectSlug ? (
                    canEditCustomHeader(null, projectSlug) ? (
                        <FormEditHeader header={data} />
                    ) : (
                        <div className="flex-row">
                            <div className="flex-col">
                                <div className="flex-content">
                                    <p>
                                        You don't have permission to edit header
                                        settings for this project.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex-row">
                        <div className="flex-col">
                            <div className="flex-content">
                                <p>
                                    Please select a Project in the dropdown
                                    above to edit its settings.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Page>
            <TooltipHeaderSettings />
        </>
    );
};

export default HeaderSettingsPage;
